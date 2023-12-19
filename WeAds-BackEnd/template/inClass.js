//raw_pwd

//----------------------------------------------------------------
//jquery datetimepicker, len cdnjs de tim link cdn cua thu vien, dung them express handelbars section neu su dung view engine la hhbs
//script:  https://cdnjs.cloudflare.com/ajax/libs/jquery-datetimepicker/2.5.20/jquery.datetimepicker.full.min.js chen sau jquery
//css: https://cdnjs.cloudflare.com/ajax/libs/jquery-datetimepicker/2.5.20/jquery.datetimepicker.min.css

$('<selector>').datetimepicker({
  timepicker: false,
  format: 'd/m/Y',
  mask: true
});
//----------------------------------------------------------------
// su dung moment de parse chuoi cuar datetimpicker

const dob = moment(raw_bob, 'DD/MM/YYYY').format('YYYY/MM/DD');
//----------------------------------------------------------------
//dung bcryotjs  thay vi bcryot. bcrypt dung hashSync vs 
const salt = bcrypt.genSaltSync();
const hashPwd = bcrypt.hashSync(raw_pwd, salt);

//luc dang nhap 
const ret = bcrypt.compareSync(req.body.pwd, pwd)
//bi lap vo tan: goi listener submit -> preventdefault -> checking -> submit -> goi ham listener submit. Cho submit ohai remove listener 

//----------------------------------------------------------------
//express session 
//app.js
app.set('trust proxy', true);
app.use('session', {
  secret: 'secret',

  cookie: {secure: true}
})
// 
req.originalUrl