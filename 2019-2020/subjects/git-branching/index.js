(function() {

  function createBranchingBaseMemoir() {
    return new gitMemoir.MemoirBuilder()

      .fileSystem('demo', fs => {}, { showFiles: false })
      .repo('demo', {}, { showInternals: false })

      .chapter('setup', {
        before: function(step, drawer) {
          drawer.requireExtension(gitMemoir.horizontalLayoutExtensionPredicate).minRepositoryGridColumns = 3;
          drawer.requireExtension(gitMemoir.horizontalLayoutExtensionPredicate).uniformRepositoryGridColumnWidth = true;
          drawer.requireExtension(gitMemoir.horizontalLayoutExtensionPredicate).uniformRepositoryGridColumnWidthAcrossFileSystems = true;
        }
      })
      .commit({ commit: { hash: '387f12' } })

      .chapter('commits')
      .commit({ commit: { hash: '9ab3fd' } })
      .commit({ commit: { hash: '4f94fa' } })

      .chapter('branch')
      .branch('feature-sub')

      .chapter('checkout')
      .checkout('feature-sub')

      .chapter('commit-on-a-branch-width', {
        before: function(step, drawer) {
          drawer.requireExtension(gitMemoir.horizontalLayoutExtensionPredicate).minRepositoryGridColumns = 4;
        }
      })

      .chapter('commit-on-a-branch')
      .commit({ commit: { hash: '712ff2' } })

      .chapter('back-to-master')
      .checkout('master')

      .chapter('another-branch')
      .checkout('fix-add', { new: true });
  }

  subject.gitMemoirs.internals = function() {
    return new gitMemoir.MemoirBuilder()
      .chapter('internals', {
        before: (step, drawer) => {
          drawer
            .requireExtension(gitMemoir.horizontalLayoutExtensionPredicate)
            .setBlobsVisible(false)
            .setBranchesVisible(false)
            .setTreesVisible(true);
        }
      })
      .fileSystem('demo', fs => {
        fs.write('demo/file1', 'data1')
      })
      .repo('demo', {}, { showInternals: false })
      .add('file1')
      .commit({ commit: { hash: '387f12' } })
      .fileSystem('demo', fs => {
        fs.write('demo/file1', 'data2')
      })
      .add('file1')
      .commit({ commit: { hash: '9ab3fd' } })
      .fileSystem('demo', fs => {
        fs.write('demo/file1', 'data3')
      })
      .add('file1')
      .commit({ commit: { hash: '4f94fa' } })
      .memoir;
  };

  subject.gitMemoirs.branchingOneLine = function() {
    return createBranchingBaseMemoir()

      .chapter('padding')
      .checkout('feature-sub')
      .commit()
      .commit()

      .memoir;
  };

  subject.gitMemoirs.branching = function() {
    return createBranchingBaseMemoir()

      .chapter('divergent-history-settings', {
        before: function(step, drawer) {
          drawer.requireExtension(gitMemoir.horizontalLayoutExtensionPredicate).minRepositoryGridRows = 2;
        }
      })

      .chapter('divergent-history')
      .commit({ commit: { hash: '2817bc' } })

      .chapter('switch-branches')
      .checkout('feature-sub')
      .checkout('fix-add')

      .chapter('fast-forward-merge-checkout')
      .checkout('master')

      .chapter('fast-forward-merge')
      .merge('fix-add')

      .chapter('delete-branch')
      .branch('fix-add', { delete: true })

      .chapter('work-on-feature-branch-settings', {
        before: function(step, drawer) {
          drawer.requireExtension(gitMemoir.horizontalLayoutExtensionPredicate).minRepositoryGridColumns = 5;
        }
      })

      .chapter('work-on-feature-branch')
      .checkout('feature-sub')
      .commit({ commit: { hash: 'f92ab0' } })

      // Disable uniform column width for later steps (or the commit graph gets too wide)
      .chapter('column-width-settings', {
        before: function(step, drawer) {
          drawer.requireExtension(gitMemoir.horizontalLayoutExtensionPredicate).getRepositoryGridLayoutStrategy().uniformColumnWidth = false;
        }
      })

      .chapter('merge-checkout')
      .checkout('master')

      .chapter('merge-settings', {
        before: function(step, drawer) {
          drawer.requireExtension(gitMemoir.horizontalLayoutExtensionPredicate).minRepositoryGridColumns = 6;
        }
      })

      .chapter('merge')
      .merge('feature-sub', { commit: { hash: '04fb82' } })

      .chapter('delete-feature-sub')
      .branch('feature-sub', { delete: true })

      .chapter('checkout-past')
      .checkout('better-sub', { new: true, refspec: '4f94fa' })

      .chapter('conflicting-change-settings', {
        before: function(step, drawer) {
          drawer.requireExtension(gitMemoir.horizontalLayoutExtensionPredicate).minRepositoryGridRows = 3;
        }
      })

      .chapter('conflicting-change')
      .commit({ commit: { hash: '98ff62' } })

      .chapter('merge-conflicting-change-settings', {
        before: function(step, drawer) {
          drawer.requireExtension(gitMemoir.horizontalLayoutExtensionPredicate).minRepositoryGridColumns = 7;
        }
      })

      .chapter('merge-conflicting-change')
      .checkout('master')
      .merge('better-sub')
      .branch('better-sub', { delete: true })

      .chapter('conflicting-file-change-checkout')
      .checkout('cleanup', { new: true, refspec: '4f94fa' })

      .chapter('conflicting-file-change-settings', {
        before: function(step, drawer) {
          drawer.requireExtension(gitMemoir.horizontalLayoutExtensionPredicate).minRepositoryGridRows = 4;
        }
      })

      .chapter('conflicting-file-change')
      .commit({ commit: { hash: '12ac65' } })

      .chapter('merge-conflicting-file-change-checkout')
      .checkout('master')

      .chapter('merge-conflicting-file-change-settings', {
        before: function(step, drawer) {
          drawer.requireExtension(gitMemoir.horizontalLayoutExtensionPredicate).minRepositoryGridColumns = 8;
        }
      })

      .chapter('merge-conflicting-file-change')
      .merge('cleanup')
      .branch('cleanup', { delete: true })

      .memoir;
  };
})();
