var AWS = require('aws-sdk');
var uuid = require('node-uuid');

AWS.config.loadFromPath('./config.json');
dynamoDb = new AWS.DynamoDB({apiVersion: '2012-10-08'});


var parse = AWS.DynamoDB.Converter.output;
var tableName = 'records';

exports.list = function(req, res){

    var queryParam = {
        TableName: tableName
    };

    dynamoDb.scan(queryParam, onScan);
    function onScan(err, data) {
        if (err) {
            console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            var result = [];
            data.Items.forEach(function(itemdata) {
                result.push(parse({ "M": itemdata}))
            });
            res.render('records',{page_title:"DynamoDb-All Records", data:result});
        }
    }
};

exports.add = function(req, res){
  res.render('add_record',{page_title:"DynamoDb-Add Record"});
};

exports.save = function(req,res){

    var data = convertToDynamoJson(JSON.parse(JSON.stringify(req.body)))
    dynamoDb.putItem(data, function(err, data) {
        if (err) {
            console.log("Error", err);
            res.redirect('/records');
        }
            res.redirect('/records');
    });
};

exports.edit = function(req, res){

    var result = [];
    var id = req.params.id;
    var getParams = {
        TableName: tableName,
        Key: {
            'id': {S: id}
        }
    };

    dynamoDb.getItem(getParams, function(err, data1) {
    if (err) {
        console.log("Error", err);
    }
    result.push(parse({ "M": data1.Item}))
    res.render('edit_record',{page_title:"DynamoDb-Edit Record", data: result});
 });
};

exports.save_edit = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.params.id;

    var saveParam = {
        TableName: 'records',
        Key: {
            id: {
                'S': id
            }
        },
        UpdateExpression: 'SET #name =:name, #address= :address, #email =:email, #phone =:phone',
        ExpressionAttributeNames: {
            '#name': 'name',
            '#address': 'address',
            '#email'  :'email',
            '#phone'   :'phone'
        },
        ExpressionAttributeValues: {
            ':name': {
                'S': input.name
            },
            ':address': {
                'S': input.address
            },
            ':email': {
                'S': input.email
            },
            ':phone': {
                'S': input.phone
            }
        }
    };
    dynamoDb.updateItem(saveParam, function(err, data) {
        if (err) {
            console.log('Error :' + err);
            res.redirect('/records');
        }
        res.redirect('/records');
    });
};

exports.delete_record = function(req,res){
          
    var id = req.params.id;
    var deleteParams = {
        TableName: tableName,
        Key: {
            'id': {S: id}
        }
    };

    dynamoDb.deleteItem(deleteParams, function(err, data) {
        if (err) {
            console.log("Error", err);
            res.redirect('/records');
        }
        res.redirect('/records');
    });
};

function convertToDynamoJson(input) {
    return  {
        TableName: 'records',
        Item: {
            id: {
                S: uuid.v1()
            },
            name: {
                S: input.name
            },
            address: {
                S: input.address
            },
            email: {
                S: input.email
            },
            phone: {
                S: input.phone
            }
        }
    };
}
