var express = require('express')
var app = express()

//LIST OF USERS
app.get('/', function(req, res, next) {
    req.getConnection(function(error, conn) {
        conn.query('SELECT * FROM registration ORDER BY id DESC',function(err, rows, fields) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                res.render('user/list', {
                    title: 'User List', 
                    data: ''
                })
            } else {
                // render to views/user/list.ejs template file
                res.render('user/list', {
                    title: 'User List', 
                    data: rows
                })
            }
        })
    })
})

// SHOW ADD USER FORM
app.get('/add', function(req, res, next){    
    // render to views/user/add.ejs
    res.render('user/add', {
        title: 'Add New User',
        fname  : '',
        lname  : '',
        age    : '',
        address:'',
        city   :''     
    })
})

// ADD NEW USER POST ACTION
app.post('/add', function(req, res, next){    
    req.assert('fname', 'Name is required').notEmpty()
    req.assert('lname', 'Name is required').notEmpty()           //Validate name
    req.assert('age', 'Age is required').notEmpty()              //Validate age
    req.assert('address', 'Address is required').notEmpty()      //Validate address
    req.assert('city', 'city is required').notEmpty()           //Validate city

    var errors = req.validationErrors()
    
    if( !errors ) {   //No errors were found.  Passed Validation!
        var user = {
            fname  : req.sanitize('fname').escape().trim(),
            lname  : req.sanitize('lname').escape().trim(),
            age    : req.sanitize('age').escape().trim(),
            address: req.sanitize('address').escape().trim(),
            city   : req.sanitize('city').escape().trim()
        }
        
        req.getConnection(function(error, conn) {
            conn.query('INSERT INTO registration SET ?', user, function(err, result) {
                                //if(err) throw err
                                if (err) {
                                    req.flash('error', err)
                                    
                                    // render to views/user/add.ejs
                                    res.render('user/add', {
                                        title: 'Add New User',
                                        fname  : user.fname,
                                        lname  : user.lname,
                                        age    : user.age,
                                        address: user.fname,
                                        city   : user.city                    
                                    })
                                } else {                
                                    req.flash('success', 'Data added successfully!')
                                    
                                    // render to views/user/add.ejs
                                    res.render('user/add', {
                                        title: 'Add New User',
                                        fname  : '',
                                        lname  : '',
                                        age    : '',
                                        address: '',
                                        city   : ''                    
                                    })
                                }
                            })
                        })
                    }
                    else{
                           //Display errors to user
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        })                
        req.flash('error', error_msg)        
        

        res.render('user/add', { 
            title: 'Add New User',
            fname  : req.body.fname,
            lname  : req.body.lname,
            age    : req.body.age,
            address: req.body.address,
            city   : req.body.city
        })
    }
})


// SHOW EDIT USER FORM
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
})


// EDIT USER POST ACTION
app.put('/edit/(:id)', function(req, res, next) {
    req.assert('fname', 'Name is required').notEmpty()
    req.assert('lname', 'Name is required').notEmpty()           //Validate name
    req.assert('age', 'Age is required').notEmpty()              //Validate age
    req.assert('address', 'Name is required').notEmpty()         //Validate address
    req.assert('city', 'City is required').notEmpty()              //Validate city
 
    var errors = req.validationErrors()
    
    if( !errors ) {   //No errors were found.  Passed Validation!
        
        var user = {
            fname  : req.sanitize('name').escape().trim(),
            lname  : req.sanitize('name').escape().trim(),
            age    : req.sanitize('age').escape().trim(),
            address: req.sanitize('address').escape().trim(),
            city   : req.sanitize('city').escape().trim()
        }
        
        req.getConnection(function(error, conn) {
            conn.query('UPDATE registration SET ? WHERE id = ' + req.params.id, user, function(err, result) {
                //if(err) throw err
                if (err) {
                    req.flash('error', err)
                    
                    // render to views/user/add.ejs
                    res.render('user/edit', {
                        title: 'Edit User',
                        id     : req.params.id,
                        fname  : req.body.fname,
                        lname  : req.body.lname,
                        age    : req.body.age,
                        address: req.body.address,
                        city   : req.body.city
                    })
                } else {
                    req.flash('success', 'Data updated successfully!')
                    
                    // render to views/user/add.ejs
                    res.render('user/edit', {
                        title: 'Edit User',
                        id     : req.params.id,
                        fname  : req.body.fname,
                        lname  : req.body.lname,
                        age    : req.body.age,
                        address: req.body.address,
                        city   : req.body.city
                    })
                }
            })
        })
    }
    else {   //Display errors to user
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        })
        req.flash('error', error_msg)
        
 
        res.render('user/edit', { 
            title: 'Edit User',            
            id     : req.params.id, 
            fname  : req.body.fname,
            lname  : req.body.lname,
            age    : req.body.age,
            address: req.body.address,
            city   : req.body.city
        })
    }
})
 
// DELETE USER
app.delete('/delete/(:id)', function(req, res, next) {
    var user = { id: req.params.id }
    
    req.getConnection(function(error, conn) {
        conn.query('DELETE FROM registration WHERE id = ' + req.params.id, user, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                // redirect to users list page
                res.redirect('/users')
            } else {
                req.flash('success', 'User deleted successfully! id = ' + req.params.id)
                // redirect to users list page
                res.redirect('/users')
            }
        })
    })
})
 
module.exports = app
                    