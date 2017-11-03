# JSurvey

Crear encuestas a partir de un Json.


## Ejemplo

```javascript
var json = {
	options : {
		title: 'JSurvey',
		banner: '',
		containerId: 'main',
		prefix: 'question',
		apiUrl: ''
	},
	questions: [
		{type: 'title', size: 'h4', text: 'Crea grandes encuestas a partir de un json'},
		{label: 'Nombre', tag: 'input', type: 'text', placeholder: 'Nombre', required: true},
		{label: 'Apellido', tag: 'input', type: 'text', required: false},
		{label: 'Empresa', tag: 'input', type: 'text', required: true},
		{label: 'Email', tag: 'input', type: 'email', required: true},
		{type: 'title', size: 'h4', text: 'Sobre la charla'},
	    {type: 'custom', tag: 'div', class: 'row', childs: [
	    	{type: 'custom', tag: 'div', class: 'col-md-6', content: 'esto es un div', childs: [
				{label: 'Charla', tag: 'input', type:'radio', required: true, childs : [ 
			        {'value': '1', 'label': 'Buena', skipTo: 8},
			        {'value': '2', 'label': 'Regular'},
			        {'value': '3', 'label': 'Mala'}
			    ]},

	    	]},
	    	{type: 'custom', tag: 'div', class: 'col-md-6', content: 'esto es un div', childs: [	
				{label: 'Contenidos', tag: 'input', type:'radio', required: true, childs : [ 
			        {'value': '1', 'label': 'Buena'},
			        {'value': '2', 'label': 'Regular'},
			        {'value': '3', 'label': 'Mala'}
			    ]},

	    	]},
	    	
	    ]},
	    {type: 'title', size: 'h4', text: 'Ordene las tecnologias segun su gusto'},
	    {type: 'sortable', class: '', childs: [
			{value: 'Node JS'},
			{value: 'Ruby on rails'},
			{value: 'PHP'},
			{value: 'Python'},

	    ]},

	    {type: 'submit', class: '', text: 'Enviar'},
	]


}


var survey = new Survey(json);
survey.init();

```
