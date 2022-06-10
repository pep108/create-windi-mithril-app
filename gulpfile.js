const gulp = require('gulp')
const gutil = require('gulp-util')
const es = require('event-stream')
const AWS = require('aws-sdk')
const awspublish = require('gulp-awspublish')
const parallelize = require('concurrent-transform')

const config = {
  awsProfile: 'default', // aws profile name saved in your ~/.aws/credentials file
  dev: {
    bucket: 'dev.example.com',
    region: 'us-west-1',
    cacheFile: './aws-cache-dev'
  },
  prod: {
    bucket: 'www.example.com',
    region: 'us-west-1',
    cacheFile: './aws-cache-prod'
  }
}

gulp.task('copy-manifest', () =>
  gulp.src('./src/manifest.json')
    .pipe(gulp.dest('./build'))
)

gulp.task('upload-development', done => upload('dev', done))
gulp.task('upload-release', done => upload('prod', done))

// Task runners
gulp.task('development', gulp.series('copy-manifest', 'upload-development'))
gulp.task('release', gulp.series('copy-manifest', 'upload-release'))

function upload (env, done) {
  gutil.log('----------------------------------------')
  gutil.log('running ' + env + ' build with config...')
  gutil.log(JSON.stringify(config[env], null, 2))
  gutil.log('----------------------------------------')

  // create a new publisher
  const publisher = awspublish.create({
    region: config[env].region,
    params: { Bucket: config[env].bucket },
    credentials: new AWS.SharedIniFileCredentials({ profile: config.awsProfile })
  }, {
    cacheFileName: config[env].cacheFile
  })

  const srcArray = ['./dist/**/*', './dist/img/**', '!./dist/**/*.html']

  // Remove the source maps from the production release
  if (env === 'prod') {
    srcArray.push('!./dist/**/*.map')
  }

  const assets = gulp.src(srcArray)
    // gzip, Set Content-Encoding headers and add .gz extension
    .pipe(awspublish.gzip())
    // publisher will add Content-Length, Content-Type and headers specified above
    // If not specified it will set x-amz-acl to public-read by default
    .pipe(parallelize(publisher.publish({
      'Cache-Control': 'max-age=315360000, no-transform, public'
    }), 10))
    // create a cache file to speed up consecutive uploads
    .pipe(publisher.cache())
    // print upload updates to console
    .pipe(awspublish.reporter())

  // HTML files get a 5 min cache-control
  const html = gulp.src('./build/**/*.html')
    .pipe(awspublish.gzip())
    .pipe(parallelize(publisher.publish({
      'Cache-Control': 'max-age=300, no-transform, public'
    }), 10))
    .pipe(publisher.cache())
    .pipe(awspublish.reporter())

  es.concat(assets, html)

  return done()
}
