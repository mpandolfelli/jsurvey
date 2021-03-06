/***************************************************************************/
/***************************************************************************/
/***************************************************************************/
//            _    _____                                       			   //
//           | |  / ____|                                      			   //	
//           | | | (___    _   _   _ __  __   __   ___   _   _ 			   //	
//       _   | |  \___ \  | | | | | '__| \ \ / /  / _ \ | | | |            //
//      | |__| |  ____) | | |_| | | |     \ V /  |  __/ | |_| |            //
//       \____/  |_____/   \__,_| |_|      \_/    \___|  \__, |            //
//                                                        __/ |            //
//                                                       |___/             //
//      																   //	
/***************************************************************************/
/***************************************************************************/
/***************************************************************************/
'use strict';


/**
 * Constructor
 * @param {[json]}
 */
var Survey = function(json){
	this.json = json;
	this.globalId = 1;
	this.surveyId = 1;
	this.surveyContainer;
	this.formContainer;
	this.skipedQuestions = [];
	this.sortableValidate = false;
	this.sortableAnswer = [];
	this.validateRadios = false;
	this.validateCheckboxs = false;
}


/**
 * Init
 * Se encarga de iniciar la encuesta con los datos del json
 */
Survey.prototype.init = function(){
	//TO DO: agregar sortable.js de esta manera
	/*var script = document.createElement('script');
	
	script.src = "lib/Sortable.min.js";
	document.getElementsByTagName('head')[0].appendChild(script);*/

	this.surveyContainer = document.createElement('form');
	this.surveyContainer.setAttribute('class', 'survey-container');
	this.surveyContainer.setAttribute('id', 'jsurvey-form');
	
	this.formContainer = document.createElement('div');
	this.formContainer.setAttribute('class', 'container-fluid');
	this.createStyles();
	this.surveyContainer.appendChild(this.formContainer);
	var container = document.getElementById(this.json.options.containerId);
	container.appendChild(this.surveyContainer);
	
	this.createForm();	
	this.recognition();
}

/**
 * Create form 
 * Genera las preguntas del json y agrega los event listeners necesarios
 */
Survey.prototype.createForm = function(){
	var that = this;
	this.json.questions.forEach(function(el) {
		that.createQuestion(el);
	});
	this.addListeners();
}

/**
 * Add Listeneres
 * Agrega los listeners nesarios
 * Se usa para agregar solamente listeners de SkipTo
 */
Survey.prototype.addListeners = function(){
	var that = this;
	var classname = document.getElementsByClassName('skip-to');
	var classnameNotSkiped = document.getElementsByClassName('not-skip');
	for (var i = 0; i < classname.length; i++) {
		var currentElement = classname[i];

	    classname[i].addEventListener('click', function(id, skipToId){
	    	var id = parseInt(currentElement.dataset.id) + 1;
			var skipToId = currentElement.dataset.skip;
			
	    	for (var j = id; j < skipToId; j++) {
	    		that.skipedQuestions.push(j);
				var el = document.getElementById('survey-'+j).style.display = 'none';
				console.log(j);
			}
	    }, false);
	}

	for (var i = 0; i < classnameNotSkiped.length; i++) {
	    classnameNotSkiped[i].addEventListener('click', function(){
	    	for (var j = 0; j < that.skipedQuestions.length; j++) {	
				var el = document.getElementById('survey-'+that.skipedQuestions[j]).style.display = 'block';
			}
	    }, false);
	}
}

/**
 * Create Styles
 * Se encarga de generar la estructura principal de la encuesta y agregar los estilos basicos.
 * Agrega las demas propiedades del json (ej: title, banner, etc)
 */
Survey.prototype.createStyles = function(){
	
	var bannerContainer = document.createElement('div');
	var banner = document.createElement('div');
	if(this.json.options.banner != ''){
		banner.style.backgroundImage = "url('"+this.json.options.banner+"')";
		banner.style.height = '240px';
	}
	
	banner.innerHTML = this.json.options.title;
	banner.setAttribute('class', 'sv-banner')
	this.surveyContainer.appendChild(banner);

	document.title = this.json.options.title;
}


/**
 * Create Input
 * Crea unicamente input del type text/email
 * @param  {[elemento HTML]} el [Elemento a crear]
 * @return {[elemento]} Elemento Padre
 */
Survey.prototype.createInput = function(el){
	
	var parentElement = document.createElement('div');
	this.setSurveyId(parentElement, true);
	var label = document.createElement('label');

 	var element = document.createElement(el.tag);
 	//element.setAttribute('x-webkit-speech', 'x-webkit-speech');
	element.setAttribute('type', el.type);
	element.setAttribute('class', 'form-control');
	var id = this.setId(element, true) - 1;
	element.setAttribute('name', this.json.options.prefix+'-'+id);
	if(el.required){
		element.className +=' required';
	}
	if(el.type == 'text'){
		if(el.speechDetection){
			element.className +=' speech-input';
		}
	}
	if(el.placeholder){
		element.placeholder = el.placeholder;
	}
	parentElement.setAttribute('class', 'form-group');
	label.innerHTML = el.label;
	parentElement.appendChild(label);
	parentElement.appendChild(element);
	return parentElement;
}


/**
 * Create radio
 * Crea unicamente radio buttons
 * @param  {[elemento HTML]} el  [elemento a crear]
 * @param  {[type]} attrs [atributos del elemento principal]
 * @param  {[Int]} newId [ID que debera llevar el elemento nuevo]
 * @return {[elemento]} Elemento padre  
 */
Survey.prototype.createRadio = function(el, attrs, newId){

	var parentElement = document.createElement('div');
	var id = newId - 1;
	var label = document.createElement('label');

	label.setAttribute('class', 'control control--radio');

 	var element = document.createElement(attrs.tag);
 	
 	element.setAttribute('type', attrs.type);
 	element.setAttribute('value', el.value);
 	element.setAttribute('name', this.json.options.prefix+'-'+id);
 	

	if(el.skipTo){
		element.setAttribute('data-skip', el.skipTo);
		element.setAttribute('data-id', id);
		element.setAttribute('class', 'skip-to');
	}else{
		element.setAttribute('class', 'not-skip');
	}

 	
	parentElement.setAttribute('class', 'radio');
		
	var helperDiv = document.createElement('div');
	helperDiv.setAttribute('class', 'control__indicator');
	label.innerHTML = el.label;
	label.appendChild(element);
	label.appendChild(helperDiv);

	parentElement.appendChild(label);
	return parentElement;
}


Survey.prototype.createCheckbox = function(el, attrs, newId){

	var parentElement = document.createElement('div');
	var id = newId - 1;
	var label = document.createElement('label');

	label.setAttribute('class', 'control control--checkbox');

 	var element = document.createElement(attrs.tag);
 	
 	element.setAttribute('type', attrs.type);
 	element.setAttribute('value', el.value);
 	element.setAttribute('name', this.json.options.prefix+'-'+id+'[]');
 	

	if(el.skipTo){
		element.setAttribute('data-skip', el.skipTo);
		element.setAttribute('data-id', id);
		element.setAttribute('class', 'skip-to');
	}else{
		element.setAttribute('class', 'not-skip');
	}

 	
	parentElement.setAttribute('class', 'checkbox');
		
	var helperDiv = document.createElement('div');
	helperDiv.setAttribute('class', 'control__indicator');
	label.innerHTML = el.label;
	label.appendChild(element);
	label.appendChild(helperDiv);

	parentElement.appendChild(label);
	return parentElement;
}

/**
 * Create custom, se usa para generar elementos HTML dinamicos
 * @param  {[elemento HTML]} el [Elemento a crear]
 * @return {[elemento]}  Elemento
 */
Survey.prototype.createCustom = function(el){
	
	var that = this;
	var parentElement = document.createElement(el.tag);
	var childElement;
	parentElement.setAttribute('class', el.class);
	if(typeof el.content !== 'undefined'){
		parentElement.innerHTML = el.content;
	}
	if(el.childs){
		el.childs.forEach(function(child) {
			
			childElement = that.createChild(child);
			
			parentElement.appendChild(childElement);
		});

	}
	return parentElement;

}

/**
 * Create child, usada para crear elementos hijos:
 * Pueden ser custom elemetns, o radio buttons, input text
 * @param  {[elemento HTML]} el Elemento a crear
 * @return {[elemento]}
 */
Survey.prototype.createChild = function(el){
	var that = this;
	var element;
	var c = 0;
	if(el.type == 'custom'){
		element = this.createCustom(el);
	}else if(el.type == 'text'){
		element = this.createInput(el);
	}else if(el.type == 'radio'){
		var attrs = el;
		var label = document.createElement('label');
		label.innerHTML = el.label;
		var container = document.createElement('div');
		var id = this.setSurveyId(container, true);
		container.appendChild(label);
		el.childs.forEach(function(childsEl, type) {

			element = that.createRadio(childsEl, attrs, id);
			//En caso de radio buttons, la clase required se le asigna solamente al primer elemento
			if(c < 1){
				var radio = element.children[0];
	 			radio.children[0].className +=' required';
	 			c++;
	 		}
			container.appendChild(element);
		});

		element = container;

	}else if(el.type == 'checkbox'){
		var attrs = el;
		var label = document.createElement('label');
		label.innerHTML = el.label;
		var container = document.createElement('div');
		var id = this.setSurveyId(container, true);
		container.appendChild(label);
		el.childs.forEach(function(childsEl, type) {
			
			element = that.createCheckbox(childsEl, attrs, id);
			//En caso de radio buttons, la clase required se le asigna solamente al primer elemento
			if(c < 1){
				var radio = element.children[0];
	 			radio.children[0].className +=' required';
	 			c++;
	 		}
			container.appendChild(element);
		});

		element = container;

	}
	
	
	return element;
}


/**
 * Create Sortable, usada para crear elementos ordenables en una lista
 * (actualmente funciona solo con listas)
 * Esta funcion ya inicializa el plugin sortable
 * @param  {[elemento HTML]} 
 * @return {[elemento]} Devuelve el elemento padre con la lista sortable dentro.
 */
Survey.prototype.createSortable = function(el){
	var parentElement = document.createElement('div');
	var element;
	var sortableElement;
	var that = this;

	this.setSurveyId(parentElement, true);
	var ul = document.createElement('ul');
	ul.setAttribute('class', el.class+' sortable');
	if(el.required){
		ul.className +=' required';
	}
	var id = this.setId(ul, true);
	el.childs.forEach(function(childsEl, type) {
		element = document.createElement('li');
		element.innerHTML = childsEl.value;
		ul.appendChild(element);
		//element = that.createRadio(childsEl, attrs);
		//	that.formContainer.appendChild(element);
	});
	parentElement.appendChild(ul);	
	var sortable = Sortable.create(ul, {
		//TO DO: Validacion del elemento, guardar el orden en un array cada vez que es ordenado
		onSort: function (/**Event*/evt) {
			that.sortableAnswer = [];
			that.sortableValidate = true;
			var items = evt.from.getElementsByTagName("li");
			for (var i = 0; i < items.length; i++) {
				that.sortableAnswer.push(items[i].innerHTML);
				
			}
		}
	}
		

	);
	return parentElement;
}

/**
 * Create button, crea el boton se guardar, y le asigna el listener de validacion
 * @param  {[elemento HTML]}
 * @return {[elemento]} 
 */
Survey.prototype.createBtn = function(el){
	var that = this;
	var element = document.createElement('a');
	var surveyData = {};
	element.setAttribute('href', 'javascript:void(0);');
	element.setAttribute('class', el.class+' survey-submit');
	element.id = 'submit';
	element.innerHTML = el.text;
	element.addEventListener('click',  function(){
		if(that.validate()){
			surveyData.form =  that.json.options.name;
			surveyData.formData = that.getFormData();
			that.post(that.json.options.apiUrl, 'post', surveyData);
			
		}
	});
	return element;
}	

Survey.prototype.showBubble = function(el, type){
	console.log(el);
	var bubble = document.createElement('div');
	bubble.setAttribute('class', 'bubble bubble-'+type);
	bubble.innerHTML = '<span class="glyphicon glyphicon-exclamation-sign"></span>';
	
	el.appendChild(bubble);
}
Survey.prototype.hideBubble = function(el){
	el.lastChild.style.display = 'none';
}

/**
 * Create question
 * Funcion generica que se encarga de dividir el tipo de elemento a crear 
 * y derivarlo a su correspondiente funcion. Una vez creado cada elemento
 * lo añade al contenedor del formulario
 * 
 * @param  {[elemento HTML]} el [description]
 * 
 */
Survey.prototype.createQuestion = function(el){
	var that = this;
	var c = 0;
	var container = document.getElementById(this.json.options.containerId);

	if(el.type == 'text' || el.type == 'email'){
		element = this.createInput(el);
		
		this.formContainer.appendChild(element);

	}else if(el.type == 'radio'){
		
		var attrs = el;
		var label = document.createElement('label');
		label.innerHTML = el.label;
		this.formContainer.appendChild(label);
		el.childs.forEach(function(childsEl, type) {
			element = that.createRadio(childsEl, attrs);
			
	 		if(c < 1){

	 			element.className +=' required';
	 			c++;
	 		}
				
			
			that.formContainer.appendChild(element);
		});
			
		
	}else if(el.type == 'checkbox'){
		
		var attrs = el;
		var label = document.createElement('label');
		label.innerHTML = el.label;
		this.formContainer.appendChild(label);
		el.childs.forEach(function(childsEl, type) {
			element = that.createCheckbox(childsEl, attrs);
			
	 		if(c < 1){

	 			element.className +=' required';
	 			c++;
	 		}
				
			
			that.formContainer.appendChild(element);
		});
			
		
	}else if(el.type == 'title'){
		var element = document.createElement(el.size);
		element.innerHTML = el.text;
		this.formContainer.appendChild(element);

	}else if(el.type == 'custom'){
		element = this.createCustom(el);
		this.formContainer.appendChild(element);
	}else if(el.type == 'sortable'){
		element = this.createSortable(el);
		this.formContainer.appendChild(element);
	}else if(el.type == 'submit'){
		element = this.createBtn(el);
		this.formContainer.appendChild(element);
	}

	//container.appendChild(this.surveyContainer);	
	
}


/**
 * SetId, se encarga de setearle un nuevo id al elemento correspondiente
 * 
 * @param {[elemento HTML} Elemento a setear ID
 * @param {[boolean]} incrementar ID Global true/false
 * @param {[int]} id  Setea un id especifico
 */
Survey.prototype.setId = function(el, increment, id){
	if(id){
		el.setAttribute('id', this.json.options.prefix+'-'+id);
	}else{
		el.setAttribute('id', this.json.options.prefix+'-'+this.globalId);
	}
	
	if(increment){
		this.globalId++;
	}
	return this.globalId;
}
Survey.prototype.setSurveyId = function(el, increment){
	el.setAttribute('id', 'survey-'+this.surveyId);
	if(increment){
		this.surveyId++;
	}
	return this.surveyId;
}


Survey.prototype.validate = function(){
	
	var elements = document.getElementsByClassName('required');
	var sortables = document.getElementsByClassName('sortable');
	var radios = [];
	var checkboxs = [];
	var inputsText = [];
	var that = this;
	
	

	for (var i = 0; i < elements.length; i++) {
		
		if(elements[i].type == 'text' || elements[i].type == 'email'){
			inputsText.push(elements[i]);
			
		}else if(elements[i].type == 'radio'){
			radios.push(elements[i]);

			
		}else if(elements[i].type == 'checkbox'){
			checkboxs.push(elements[i]);

			
		}
		
	}

	var validateInputs = that.validateInputs(inputsText);

	for (var k = 0; k < sortables.length; k++) {
		
		if(!that.sortableValidate){

			if(!sortables[k].classList.contains('error')){
				sortables[k].className += " error";
				that.showBubble(sortables[k].parentNode, 'error');
				that.sortableValidate = false;
			}
		}else{
			if(sortables[k].classList.contains('error')){
				that.hideBubble(sortables[k].parentNode);
				sortables[k].classList.remove('error');
				that.sortableValidate = true;
			}
		}
	}

	

	for (var j = 0; j < radios.length; ++ j){

		var radioName = radios[j].getAttribute("name"); 
		var radio = document.querySelectorAll('input[name="'+radioName+'"]:checked');
		
        if (radio.length > 0){
        	if(radios[j].parentNode.parentNode.parentNode.classList.contains('error')){
	        	radios[j].parentNode.parentNode.parentNode.classList.remove('error');
	        	that.hideBubble(radios[j].parentNode.parentNode.parentNode);
	        	
        	}
        	that.validateRadios = true;
        }else{
        	if(!radios[j].parentNode.parentNode.parentNode.classList.contains('error')){
        		radios[j].parentNode.parentNode.parentNode.className+= ' error';
        		that.showBubble(radios[j].parentNode.parentNode.parentNode, 'error');
        		
        	}
        	that.validateRadios = false;
        }
    }

    for (var j = 0; j < checkboxs.length; ++ j){

		var checkboxName = checkboxs[j].getAttribute("name"); 
		var checkbox = document.querySelectorAll('input[name="'+checkboxName+'"]:checked');
		
        if (checkbox.length > 0){
        	if(checkboxs[j].parentNode.parentNode.parentNode.classList.contains('error')){
	        	checkboxs[j].parentNode.parentNode.parentNode.classList.remove('error');
	        	that.hideBubble(checkboxs[j].parentNode.parentNode.parentNode);
	        	
        	}
        	that.validateCheckboxs = true;
        }else{
        	if(!checkboxs[j].parentNode.parentNode.parentNode.classList.contains('error')){
        		checkboxs[j].parentNode.parentNode.parentNode.className+= ' error';
        		that.showBubble(checkboxs[j].parentNode.parentNode.parentNode, 'error');
        		
        	}
        	that.validateCheckboxs = false;
        }
    }
   
    if(validateInputs && that.validateRadios && that.validateCheckboxs && that.sortableValidate){
    	return true;

    }else{
    	return false;
    }
    
}

Survey.prototype.validateInputs = function(inputs){
	var that = this;
	var validate = true;
	for (var i = 0; i < inputs.length; i++) {
		if(inputs[i].value == ''){
			if(!inputs[i].classList.contains('error')){
				inputs[i].className += " error";
				that.showBubble(inputs[i].parentNode, 'error');
				validate = false;
			}
			
		}else{
			if(inputs[i].classList.contains('error')){
				that.hideBubble(inputs[i].parentNode);
				inputs[i].classList.remove('error');
				
			}
		
		}
	}
	return validate;
}

Survey.prototype.recognition = function(){

	var elements = document.getElementsByClassName('speech-input');

	[].forEach.call(elements, function(inputEl) {
		
		var mic = document.createElement('a');
		mic.setAttribute('class', 'mic-icon');
		mic.innerHTML = '<i class="fa fa-microphone" aria-hidden="true"></i>';
		
		inputEl.parentNode.appendChild(mic);
		var recognition =  new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
		recognition.continuous = true;
		recognition.interimResults = true;
		recognition.lang = 'es-AR';
		var recognizing = false;
		var timeout;
		var patience = 10;
		function restartTimer() {
			timeout = setTimeout(function() {
				recognition.stop();
			}, patience * 1000);
		}

		recognition.onstart = function() {
			recognizing = true;
			restartTimer();
			
		};
		recognition.onresult = function(event) {
			clearTimeout(timeout);
		    console.log('Dijiste: ', event.results[0][0].transcript);
		    inputEl.value = event.results[0][0].transcript;
		    restartTimer();
		};
		recognition.onend = function() {
			recognizing = false;
			clearTimeout(timeout);
		}
		mic.addEventListener('click', function(event) {
			event.preventDefault();

			// stop and exit if already going
			if (recognizing) {
				recognition.stop();
				return;
			}

			
			recognition.start();
		}, false);
	});
	
}

Survey.prototype.getFormData = function(){
	var formData = [];
 	var form = document.getElementById("jsurvey-form");
  	for(var i=0; i < form.elements.length; i++){
	    var e = form.elements[i];
	    var objectData = {};
	   	var radioData = {};
	   	var checkboxData = {};

	   	if(e.type === 'text' || e.type === 'email'){
	   		objectData.fieldName = e.name;
	    	objectData.fieldValue = e.value;
	    	formData.push(objectData);

	   	}else if(e.type === 'radio' && e.checked){
	   		radioData.fieldName = e.name;
	    	radioData.fieldValue = e.value;
	    	formData.push(radioData);
	   	}else if(e.type === 'checkbox' && e.checked){
	   		checkboxData.fieldName = e.name;
	    	checkboxData.fieldValue = e.value;
	    	formData.push(checkboxData);
	   	}
 		
	}
	formData.push(this.sortableAnswer);
	console.log(formData);
	return formData;
}

Survey.prototype.post = function(url, method, data){
	var request = new XMLHttpRequest();   // new HttpRequest instance 
	request.open(method, url);
	request.setRequestHeader("Content-Type", "application/json");
	request.send(JSON.stringify({data: data}));

	request.onreadystatechange = showResponse;

	function showResponse(){
		if (request.readyState == 4) {
            if (request.status == 200) {
                console.log(request.responseText);
            } else {
                console.log('Hubo problemas con la petición.');
            }
        }
	}
	
}