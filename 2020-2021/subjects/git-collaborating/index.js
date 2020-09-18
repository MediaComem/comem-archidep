(function() {
  subject.gitMemoirs.github = function() {
    return new gitMemoir.MemoirBuilder()

      .chapter('staging', {
        before: function(step, drawer) {
          drawer.requireExtension(gitMemoir.horizontalLayoutExtensionPredicate).uniformRepositoryGridColumnWidthAcrossFileSystems = true;
          drawer.requireExtension(gitMemoir.horizontalLayoutExtensionPredicate).fileSystemWeight = 1;
          drawer.requireExtension(gitMemoir.drawFileSystemExtensionPredicate).getViewStrategy().setDefaultIcon({ svg: getComputerIcon(), aspectRatio: 80 / 48 });
          drawer.requireExtension(gitMemoir.drawFileSystemExtensionPredicate).getViewStrategy().setCustomIcon('github', { svg: getGithubIcon() });
        }
      })
      .fileSystem('bob', fs => {}, {
        /*icon: {
          svg: getComputerIcon(),
          aspectRatio: 80 / 48
        }*/
      })
      .repo('bob-project')
      .commit({ commit: { hash: '387f12' } })
      .commit({ commit: { hash: '9ab3fd' } })
      .commit({ commit: { hash: '4f94ba' } })

      .chapter('remote')
      .fileSystem('github', function() {}, {
        /*icon: {
          svg: getGithubIcon(),
          aspectRatio: 1
        }*/
      })
      .repo('shared-project', { bare: true })

      .chapter('bob-remote')
      .fileSystem('bob')
      .repo('bob-project')
      .remote.add('origin', 'github', 'shared-project')

      .chapter('bob-push')
      .push('origin', 'master')

      .chapter('alice-remote', {
        before: function(step, drawer) {
          drawer.requireExtension(gitMemoir.drawFileSystemExtensionPredicate).getViewStrategy().setHiddenFileSystems([ 'bob' ]);
        }
      })
      .fileSystem('alice', fs => {}, {
        /*icon: {
          svg: getComputerIcon(),
          aspectRatio: 80 / 48
        }*/
      })
      .repo('alice-project')
      .remote.add('origin', 'github', 'shared-project')

      .chapter('alice-pull')
      .pull('origin', 'master')

      .chapter('alice-commit-settings', {
        before: function(step, drawer) {
          drawer.requireExtension(gitMemoir.horizontalLayoutExtensionPredicate).minRepositoryGridColumns = 4;
        }
      })

      .chapter('alice-commit')
      .commit({ commit: { hash: '92fb8c' } })

      .chapter('alice-push')
      .push('origin', 'master')

      .chapter('bob-look', {
        before: function(step, drawer) {
          drawer.requireExtension(gitMemoir.drawFileSystemExtensionPredicate).getViewStrategy().setHiddenFileSystems([ 'alice' ]);
        }
      })
      .fileSystem('bob')
      .repo('bob-project')

      .chapter('bob-fetch')
      .fetch({ remote: 'origin' })

      .chapter('bob-merge')
      .merge('origin/master')

      .chapter('box-fix-settings', {
        before: function(step, drawer) {
          drawer.requireExtension(gitMemoir.horizontalLayoutExtensionPredicate).minRepositoryGridColumns = 5;
        }
      })

      .chapter('bob-fix')
      .commit({ commit: { hash: '55e12a' } })
      .push('origin', 'master')

      .chapter('alice-fix-prepare', {
        before: function(step, drawer) {
          drawer.requireExtension(gitMemoir.drawFileSystemExtensionPredicate).getViewStrategy().setHiddenFileSystems([ 'bob' ]);
        }
      })
      .fileSystem('alice')
      .repo('alice-project')

      .chapter('alice-fix')
      .commit({ commit: { hash: '102c34' } })

      .chapter('alice-fetch-changes')
      .fetch({ remote: 'origin' })

      .chapter('alice-pull-changes-settings', {
        before: function(step, drawer) {
          drawer.requireExtension(gitMemoir.horizontalLayoutExtensionPredicate).minRepositoryGridColumns = 6;
        }
      })

      .chapter('alice-pull-changes')
      .pull('origin', 'master')

      .chapter('alice-push-merge')
      .push('origin', 'master')

      .chapter('bob-pull-merge-prepare', {
        before: function(step, drawer) {
          drawer.requireExtension(gitMemoir.drawFileSystemExtensionPredicate).getViewStrategy().setHiddenFileSystems([ 'alice' ]);
        }
      })
      .fileSystem('bob')
      .repo('bob-project')

      .chapter('bob-pull-merge')
      .pull('origin', 'master')

      .memoir;
  };

  function getComputerIcon() {
    return '<svg height="48px" id="Layer_1" style="enable-background:new 0 0 80 48;" version="1.1" viewBox="0 0 80 48" width="80px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><path d="M13.68,37.459V6.87c0-1.1,0.9-2,2-2h49.339c1.1,0,2,0.9,2,2   v30.589" style="fill:none;stroke:#231F20;stroke-miterlimit:10;"/></g><rect height="26.413" style="fill:none;stroke:#231F20;stroke-miterlimit:10;" width="46.555" x="17.016" y="8.368"/><circle cx="40.139" cy="6.559" r="0.488" style="fill:#231F20;"/><rect height="0.925" style="fill:#231F20;" transform="matrix(0.7073 0.7069 -0.7069 0.7073 24.3872 -39.0558)" width="4.486" x="57.11" y="9.457"/><rect height="0.924" style="fill:#231F20;" transform="matrix(0.7071 0.7071 -0.7071 0.7071 24.9522 -37.3743)" width="8.657" x="53.263" y="10.971"/><polygon points="59.783,17.902 50.41,8.532 51.068,7.88 60.439,17.249 " style="fill:#231F20;"/><g><path d="M73.641,40.309c0,0.549-0.45,1-1,1H7.274c-0.55,0-1-0.451-1-1   v-1.393c0-0.551,0.45-1,1-1h65.366c0.55,0,1,0.449,1,1V40.309z" style="fill:none;stroke:#231F20;stroke-miterlimit:10;"/></g><line style="fill:none;stroke:#231F20;stroke-miterlimit:10;" x1="6.84" x2="10.026" y1="41.152" y2="43.311"/><line style="fill:none;stroke:#231F20;stroke-miterlimit:10;" x1="9.717" x2="69.969" y1="43.363" y2="43.363"/><line style="fill:none;stroke:#231F20;stroke-miterlimit:10;" x1="69.607" x2="72.795" y1="43.438" y2="41.281"/></svg>';
  }

  function getGithubIcon() {
    return '<svg aria-labelledby="title" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="1.414"><title>GitHub icon</title><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>';
  }
})();
