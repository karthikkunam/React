// var oracledb = require("oracledb");

// oracledb.getConnection(
//     {
//         user          :"RISSTORE",
//         password      : "SevenReta11$tore",
//         connectString : "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = HOSTNAME)(PORT = 1573))(CONNECT_DATA =(SID= RIS)))"
//     },
//     function(err, connection)
//     {
//         if (err) { console.error(err); return; }
//         connection.execute(
//             "SELECT * "
//             + "FROM authorised_employee_vw ",
//             function(err, result)
//             {
//                 if (err) { console.error(err); return; }
//                 console.log(result.rows);
//             });
//     });