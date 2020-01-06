if(process.env.NODE_ENV === 'production'){
  module.exports = {
    mongoURI : 'mongodb://Rohit:ramramrc*8787@ds163825.mlab.com:63825/mydiary-prod'
  }
}else{
  module.exports = {
    mongoURI : 'mongodb://localhost/mydiary'
  }
}