var express = require('express')
var app = express()

//LIST OF USERS

app.get('/', function (req, res) {
    console.log(req);
    connection.query('select * from registration', function (error, results, fields) {
       if (error) throw error;
       res.end(JSON.stringify(results));
     });
 });

// SHOW ADD USER FORM
/* app.get('/add', function(req, res, next){    
    // render to views/user/add.ejs
    res.render('user/add', {
        title: 'Add New User',
        fname  : '',
        lname  : '',
        age    : '',
        address:'',
        city   :''     
    })
}) */

// ADD NEW USER POST ACTION
app.post('/add', function (req, res) {
    var postData  = req.body;
    connection.query('INSERT INTO registration SET ?', postData, function (error, results, fields) {
    if (error) throw error;
    res.end(JSON.stringify(results));
  });
 });

/* // SHOW EDIT USER FORM
app.get('/edit/(:id)', function(req, res, next){
    req.getConnection(function(error, conn) {
        conn.query('SELECT * FROM registration WHERE id = ' + req.params.id, function(err, rows, fields) {
            if(err) throw err
            
            // if user not found
            if (rows.length <= 0) {
                req.flash('error', 'User not found with id = ' + req.params.id)
                res.redirect('/users')
            }
            else { // if user found
                // render to views/user/edit.ejs template file
                res.render('user/edit', {
                    title: 'Edit User', 
                    //data: rows[0],
                    id: rows[0].id,
                    fname  : rows[0].fname,
                    lname  : rows[0].lname,
                    age    : rows[0].age,
                    address: rows[0].address,
                    city   : rows[0].city                    
                })
            }            
        })
    })
}) */


// EDIT USER POST ACTION

app.put('/edit', function (req, res) {
    connection.query('UPDATE `registration` SET `fname`=?,`laname`=?,`age`=?,`address`=?,`city`=? where `id`=?', [req.body.fname,req.body.lname,req.body.age,req.body.address,req.body.city, req.body.id], function (error, results, fields) {
    if (error) throw error;
    res.end(JSON.stringify(results));
  });
 });
 
// DELETE USER
app.delete('/delete', function (req, res) {
    console.log(req.body);
    connection.query('DELETE FROM `registration` WHERE `id`=?', [req.body.id], function (error, results, fields) {
    if (error) throw error;
    res.end('Record has been deleted!');
  });
 });
 
module.exports = app
                    