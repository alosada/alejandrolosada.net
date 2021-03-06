window.addEventListener('load',function(){
controller = new Controller
view = new View
mailer = new Mailer
animation = new Animation
controller.initialize(mailer, view, animation)
view.setBlinker()
})

function Controller(){
  this.showShape = 0;
}

Controller.prototype = {
  initialize: function(mailer, view, animation){
    this.mailer = mailer
    this.view = view
    this.animation = animation
    this.playButton = this.view.getPlayButton()
    this.bindListeners()
  },

  bindListeners: function(){
    $('#contact-form').submit(this.sendMailWrapper);
    $('#contact-link').on('click', view.containerIn);
    $('#portfolio-link').on('click', view.containerIn);
    $('.close').on('click', view.close);
    $('#play').on('click', this.animationPicker);
    $('#done').on('click', this.stopAnimation)
  },

  sendMailWrapper: function(e){
    e.preventDefault();
    var formData = view.getFormData();
    if (mailer.prepMail(formData)){
      view.contactOut()
      view.dispOkay("Message sent successfully")
    }
    else{
      view.dispError("Oops, there was a problem. Please try again.")
    }
  },

  startAnimation: function(){
    clearInterval(view.blinker);
    view.hideMain();
    animation.prepAll();
    setTimeout(function(){animation.animate()},400);
    view.showDone();
  },

  animationPicker: function(e){
    e.preventDefault();
    if (controller.showShape===0){
      controller.startAnimation()
      controller.showShape = 1;
    }
    else if (controller.showShape===1){
      animation.transform(animation.targets.helix, 4000)
      controller.showShape = 2
    }
    else if (controller.showShape===2){
      animation.transform(animation.targets.grid, 4000)
      controller.showShape = 3
    }
    else if (controller.showShape===3){
      animation.transform(animation.targets.doubleHelix, 4000)
      controller.showShape = 4
    }
    else {
      animation.transform(animation.targets.sphere, 4000)
      controller.showShape = 1
    }
  },

  stopAnimation: function(e){
    e.preventDefault();
    view.hideDone()
    animation.transform(animation.targets.table, 4000)
    setTimeout(function(){
      view.clearContainer()
      view.showMain()
    }, 5000)
    controller.showShape = 0;
  }
}


function Mailer(){
  this.lasllaves = "w0G3bYcspMgrO8ewpZGelA";
  this.address = "https://mandrillapp.com/api/1.0/messages/send.json"
  this.i=0;
}

Mailer.prototype = {
  prepMail: function(mail){
    var data = {
      key: this.lasllaves,
      message: mail
    }
    return this.sendMail(data)
  },

  sendMail: function(data){
    var ajaxReq = $.ajax({
    url: this.address,
    type: "POST",
    data: JSON.stringify(data),
    }).done(function(r) {
      if(r[0].status=="sent"){
        return true
      }
      else{
        return false
      }
    })
  },
}

function Animation(){
    this.targets = { table: [], sphere: [], helix: [], grid: [], doubleHelix: [] };
    this.objects = []
}

Animation.prototype = {
  prepAll: function() {
    this.camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 0.1, 1000 );
    this.camera.position.z = 5000;
    this.scene = new THREE.Scene();
    this.renderer = new THREE.CSS3DRenderer();
    this.text = ["A",5,1,
                 "c",7,1,
                 "o",8,1,
                 "l",9,1,
                 "l",10,1,
                 "e",11,1,
                 "c",12,1,
                 "t",13,1,
                 "i",14,1,
                 "o",15,1,
                 "n",16,1,
                 "o",18,1,
                 "f",19,1,
                 "l",21,1,
                 "i",22,1,
                 "n",23,1,
                 "k",24,1,
                 "s",25,1,
                 "o",27,1,
                 "n",28,1,
                 "A",8,2,
                 "L",9,2,
                 "E",10,2,
                 "J",11,2,
                 "A",12,2,
                 "N",13,2,
                 "D",14,2,
                 "R",15,2,
                 "O",16,2,
                 "E",18,2,
                 ".",19,2,
                 "L",21,2,
                 "O",22,2,
                 "S",23,2,
                 "A",24,2,
                 "D",25,2,
                 "A",26,2,
                 "F",5,3,
                 "u",6,3,
                 "l",7,3,
                 "l",8,3,
                 "-",9,3,
                 "s",10,3,
                 "t",11,3,
                 "a",12,3,
                 "c",13,3,
                 "k",14,3,
                 "w",16,3,
                 "e",17,3,
                 "b",18,3,
                 "d",20,3,
                 "e",21,3,
                 "v",22,3,
                 "e",23,3,
                 "l",24,3,
                 "o",25,3,
                 "p",26,3,
                 "e",27,3,
                 "r",28,3,
                 ".",29,3,
                 "L",1,4,
                 "i",2,4,
                 "n",3,4,
                 "k",4,4,
                 "e",5,4,
                 "d",6,4,
                 "I",7,4,
                 "n",8,4,
                 "|",9,4,
                 "G",10,4,
                 "i",11,4,
                 "t",12,4,
                 "h",13,4,
                 "u",14,4,
                 "b",15,4,
                 "|",16,4,
                 "P",17,4,
                 "o",18,4,
                 "r",19,4,
                 "t",20,4,
                 "f",21,4,
                 "o",22,4,
                 "l",23,4,
                 "i",24,4,
                 "o",25,4,
                 "|",26,4,
                 "C",27,4,
                 "o",28,4,
                 "n",29,4,
                 "t",30,4,
                 "a",31,4,
                 "c",32,4,
                 "t",33,4]
    this.prepTable()
    this.prepSphere()
    this.prepHelix()
    this.prepDoubleHelix()
    this.prepGrid()

    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.renderer.domElement.style.position = 'absolute';
    document.getElementById( 'container' ).appendChild( this.renderer.domElement );

    controls = new THREE.TrackballControls( this.camera, this.renderer.domElement );
    controls.rotateSpeed = 0.5;
    controls.minDistance = 500;
    controls.maxDistance = 6000;
    controls.addEventListener( 'change', this.render );

    this.transform( this.targets.sphere, 5000 );
  },

  prepTable: function(){
    for ( var i = 0; i < this.text.length; i += 3 ) {
      var letter = document.createElement( 'div' );
      letter.className = 'letter';
      letter.textContent = this.text[i];
      var object = new THREE.CSS3DObject( letter );
      object.position.x = ( this.text[ i + 1 ] * 140 ) - 2200;
      object.position.y = - ( this.text[ i + 2 ] * 180 ) + 750;
      this.scene.add( object );

      this.objects.push( object );

      var object = new THREE.Object3D();
      object.position.x = ( this.text[ i + 1 ] * 140 ) - 2200;
      object.position.y = - ( this.text[ i + 2 ] * 180 ) + 750;

      this.targets.table.push( object );
    }
  },

  prepSphere: function(){
    var vector = new THREE.Vector3();
      for ( var i = 0, l = this.objects.length; i < l; i ++ ) {
        var phi = Math.acos( -1 + ( 2 * i ) / l );
        var theta = Math.sqrt( l * Math.PI ) * phi;
        var object = new THREE.Object3D();
        object.position.x = 800 * Math.cos( theta ) * Math.sin( phi );
        object.position.y = 800 * Math.sin( theta ) * Math.sin( phi );
        object.position.z = 800 * Math.cos( phi );
        vector.copy( object.position ).multiplyScalar( 2 );
        object.lookAt( vector );
        this.targets.sphere.push( object );
      }
  },

  prepHelix: function() {
    var vector = new THREE.Vector3();
    for ( var i = 0, l = this.objects.length; i < l; i ++ ) {
      var phi = i * 0.175 + Math.PI;
      var object = new THREE.Object3D();
      object.position.x = 900 * Math.sin( phi );
      object.position.y = - ( i * 16 ) + 900;
      object.position.z = 900 * Math.cos( phi );
      vector.x = object.position.x * 2;
      vector.y = object.position.y;
      vector.z = object.position.z * 2;
      object.lookAt( vector );
      this.targets.helix.push( object );
    }
  },
  prepDoubleHelix: function(){
    var vector = new THREE.Vector3();
    for ( var i = 0, l = this.objects.length; i < l; i ++ ) {
      if (i%2===1){
        var phi = i * 0.175 + 2*Math.PI;
      }
      else {
        var phi = i * 0.175 + Math.PI;
      }
      var object = new THREE.Object3D();
      object.position.x = 450 * Math.sin( phi );
      object.position.y = - ( i * 64 ) + 1800;
      object.position.z = 450 * Math.cos( phi );
      vector.x = object.position.x * 2;
      vector.y = object.position.y;
      vector.z = object.position.z * 2;
      object.lookAt( vector );
      this.targets.doubleHelix.push( object );
    }
  },

  prepGrid: function(){
    for ( var i = 0; i < this.objects.length; i ++ ) {
      var object = new THREE.Object3D();
      object.position.x = ( ( i % 5 ) * 400 ) - 800;
      object.position.y = ( - ( Math.floor( i / 5 ) % 5 ) * 400 ) + 800;
      object.position.z = ( Math.floor( i / 25 ) ) * 1000 - 2000;
      this.targets.grid.push( object );
    }
  },

  render: function(){
    animation.renderer.render( animation.scene, animation.camera );
  },

  transform: function(targets, duration){
    TWEEN.removeAll();

    for ( var i = 0; i < this.objects.length; i ++ ) {

      var object = this.objects[ i ];
      var target = targets[ i ];

      new TWEEN.Tween( object.position )
        .to( { x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration )
        .easing( TWEEN.Easing.Exponential.InOut )
        .start();

      new TWEEN.Tween( object.rotation )
        .to( { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration )
        .easing( TWEEN.Easing.Exponential.InOut )
        .start();
    }

    new TWEEN.Tween( this )
      .to( {}, duration * 2 )
      .onUpdate( this.render )
      .start();
  },

  animate: function(){
    requestAnimationFrame( animation.animate );
    TWEEN.update();
    controls.update();
  },

  onWindowResize: function(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.render();
  },

}

function View(){
}

View.prototype = {
  containerIn: function(e){
    e.preventDefault()
    var prefix = e.target.id.split('-')[0]
    $("#"+prefix+"-container").fadeIn()
  },

  contactOut: function(){
    $("#contact-container").fadeOut()
  },

  close: function(e){
    e.preventDefault()
    var parent = $('#'+e.target.parentElement.id)
    parent.fadeOut()
    setTimeout(function(){parent.removeClass('error okay')},1000)
  },

  getFormData: function(){
    var formRaw=$('form').serializeArray();

    var formData = {
      name:formRaw[0].value,
      from_email:formRaw[1].value,
      html:"<p>"+formRaw[2].value+"</p>",
      text:formRaw[2].value,
      subject:"Nuevo contacto: "+formRaw[1].value,
      to:[{email:"alosada@gmail.com"}]
    };

    return formData
  },

  dispError: function(text){
    $('#alert-box').addClass("error").fadeIn()
    $('#alert-box span').text(text)

  },

  dispOkay: function(text){
    $('#alert-box').addClass("error").fadeIn()
    $('#alert-box span').text(text)
  },

  hideMain: function(){
    $('#main').fadeOut();
  },

  showMain: function(){
    $('#main').fadeIn();
  },

  showDone: function(){
    document.getElementById( 'done' ).style.display = 'inline';
  },

  hideDone: function(){
    document.getElementById( 'done' ).style.display = 'none';

  },

  getPlayButton: function(){
    return document.getElementById( 'play' );
  },

  clearContainer: function(){
    document.getElementById( 'container' ).innerHTML=''
  },

  toggler: function(){
    var playButton = $('#play')
      if(playButton.hasClass('red')){playButton.removeClass('red')}
      else{playButton.addClass('red')}
  },

  setBlinker: function(){
    setTimeout(function(){
      view.blinker = setInterval(function(){view.toggler()},1000)
    },10000)
  }
}