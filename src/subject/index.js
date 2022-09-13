import subject from 'courses-md/dist/client.js';
import * as GitMemoir from 'git-memoir';

window.gitMemoir = GitMemoir;
window.subject = subject;

import { GitMemoirController } from './git-memoir.js';

import 'font-awesome/css/font-awesome.css';

import './assets/bootstrap-btn.css';
import 'tippy.js/dist/tippy.css';
import './assets/fonts/DroidSerif/DroidSerif.css';
import './assets/fonts/UbuntuMono/UbuntuMono.css';
import './assets/fonts/YanoneKaffeesatz/YanoneKaffeesatz.css';
import './assets/slides.css';
import './assets/git-memoir.css';

import heigLogo from './assets/heig.png';

subject.setLogo({
  url: 'https://heig-vd.ch',
  imageUrl: heigLogo,
  height: 60
});

subject
  .afterStart(() => GitMemoirController.start())
  .start();
