/*! Content script */
$(function() {
  function versionsActualAtDate(date, versions) {
    return _.filter(versions, function(version) {
      var fromDate = (version.fromDate) ? new Date(version.fromDate) : new Date('1970/01/01'),
          toDate = (version.toDate) ? new Date(version.toDate) : new Date();
      fromDate.setHours(0, 0, 0, 0);
      toDate.setHours(23, 59, 59, 999);

      return (date >= fromDate && date <= toDate);
    });
  }

  var questionPage = $('body.question-page');
  if (!questionPage) { return }

  var tags = _.pluck(questionPage.find('.question [rel=tag]'), 'text'),
      platform = _.max(versionHint.platformData, function(platform) { return _.intersection(platform.tags, tags).length });
  if (!platform) { return }

  var questionDate = new Date( questionPage.find('.question .post-signature.owner .relativetime').attr('title') ),
      versions = versionsActualAtDate(questionDate, platform.versions);
  if (versions.length == 0) { return }

  var versionsString = _.reduce(versions, function(memo, version) { return memo + ' <span class="post-tag">' + version.name + '</span>' }, ''),
      postVersionsString = (versions.length > 1) ? 'where the most recent versions.' : 'was the most recent version.' ;
  questionPage.find('.question .post-text').prepend('<p><em>At time of writing</em>' + versionsString + ' <em>' + postVersionsString + '</em></p>');
});
