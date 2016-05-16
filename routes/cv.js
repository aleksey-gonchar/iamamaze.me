var cvCtrl = $requireTree('controllers/cv')

var CV = $require('models/cv')

module.exports = function (router) {
  router.get('/cv', cvCtrl.get(CV))
  router.get('/cv/summary', cvCtrl.get(CV.summary))
  router.get('/cv/contacts', cvCtrl.get(CV.contacts))
  router.get('/cv/languages', cvCtrl.get(CV.languages))
  router.get('/cv/hobbies', cvCtrl.get(CV.hobbies))
  router.get('/cv/education', cvCtrl.get(CV.education))
  router.get('/cv/skills', cvCtrl.get(CV.skills))
  router.get('/cv/skills-last-updated', cvCtrl.get(CV.skillsLastUpdated))
  router.get('/cv/projects', cvCtrl.get(CV.projects))
}
