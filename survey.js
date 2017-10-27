/***************************************************************************/
//	  ____                                                _   ____  		
//	 / ___|   _   _   _ __  __   __   ___   _   _        | | / ___| 
//	 \___ \  | | | | | '__| \ \ / /  / _ \ | | | |    _  | | \___ \ 
//	  ___) | | |_| | | |     \ V /  |  __/ | |_| |   | |_| |  ___) |
//	 |____/   \__,_| |_|      \_/    \___|  \__, |    \___/  |____/ 
//	                                        |___/                   
//	
/***************************************************************************/
var Survey = function(json){
	this.json = json;
	this.globalId = 1;
	this.surveyId = 1;
	this.surveyContainer;
	this.formContainer;
	this.skipedQuestions = [];
}

Survey.prototype.init = function(){
	var script = document.createElement('script');
	
	script.src = "lib/Sortable.min.js";
	document.getElementsByTagName('head')[0].appendChild(script);

	this.surveyContainer = document.createElement('div');
	this.surveyContainer.setAttribute('class', 'survey-container');
	
	this.formContainer = document.createElement('div');
	this.formContainer.setAttribute('class', 'container-fluid');
	this.createStyles();
	this.surveyContainer.appendChild(this.formContainer);
	var container = document.getElementById(this.json.options.containerId);
	container.appendChild(this.surveyContainer);
	
	this.createForm();	
	
}

Survey.prototype.skipTo = function(skipToId){
	
	/*for (var i = id; i >= skipToId; i++) {
		var el = document.getElementById('question-'+i).style.display = 'none';;
		console.log('ocultando: '+el);
	}*/
}

Survey.prototype.createForm = function(){
	var that = this;
	this.json.questions.forEach(function(el) {
		that.createQuestion(el);
	});
	this.addListeners();
}

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
Survey.prototype.createStyles = function(){
	
	var bannerContainer = document.createElement('div');
	var banner = document.createElement('div');
	if(this.json.options.banner != ''){
		banner.style.backgroundImage = "url('"+this.json.options.banner+"')";
		banner.style.height = '240px';
	}
	
	banner.innerHTML = 'survey js';
	banner.setAttribute('class', 'sv-banner')
	this.surveyContainer.appendChild(banner);

	document.title = this.json.options.title;
}

Survey.prototype.createInput = function(el){
	
	var parentElement = document.createElement('div');
	this.setSurveyId(parentElement, true);
	var label = document.createElement('label');

 	var element = document.createElement(el.tag);
	element.setAttribute('type', el.type);
	element.setAttribute('class', 'form-control');
	this.setId(element, true);
	if(el.required){
		element.className +=' required';
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

Survey.prototype.createRadio = function(el, attrs, newId){
	var c = 0;

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

Survey.prototype.createCustom = function(el){
	
	var that = this;
	var parentElement = document.createElement(el.tag);
	
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

Survey.prototype.createChild = function(el){
	var that = this;
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

Survey.prototype.createSortable = function(el){
	var parentElement = document.createElement('div');
	this.setSurveyId(parentElement, true);
	var ul = document.createElement('ul');
	ul.setAttribute('class', el.class+' sortable');
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
		onUpdate: function (/**Event*/evt) {
			console.log(evt);
		}
	}
		

	);
	return parentElement;
}

Survey.prototype.createBtn = function(el){
	var that = this;
	var element = document.createElement('a');
	element.setAttribute('href', 'javascript:void(0);');
	element.setAttribute('class', el.class+' survey-submit');
	element.id = 'submit';
	element.innerHTML = el.text;
	element.addEventListener('click',  function(){
		that.validate();
	});
	return element;
}	

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
	console.log('validando...');
	var elements = document.getElementsByClassName('required');
	var radios = [];

	for (var i = 0; i < elements.length; i++) {
		
		if(elements[i].type == 'text' || elements[i].type == 'email'){
			if(elements[i].value == ''){
				if(!elements[i].classList.contains('error')){
					elements[i].className += " error";
				}
				
			}else{
				elements[i].classList.remove('error');
			}
		}else if(elements[i].type == 'radio'){
			radios.push(elements[i]);

			
		}else if(elements[i].type == 'sortable'){

		}
		
	}



	for (j = 0; j < radios.length; ++ j){

		var radioName = radios[j].getAttribute("name"); 
		var radio = document.querySelectorAll('input[name="'+radioName+'"]:checked');
		
        if (radio.length > 0){
        	radios[j].parentNode.parentNode.parentNode.classList.remove('error');
        
        }else{
        	if(!radios[j].parentNode.parentNode.parentNode.classList.contains('error')){
        		radios[j].parentNode.parentNode.parentNode.className+= ' error';
        	}
        }
    }
   
}