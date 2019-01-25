/*
* GET home page.
*/
exports.index = function(_req, res){
    var message = '';
  res.render('index',{message: message});
};
