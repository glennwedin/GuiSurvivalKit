(function (w, d, u) {
	"use strict";

	var tools = {
		extend: function (){
		    for(var i=1; i<arguments.length; i++)
		        for(var key in arguments[i])
		            if(arguments[i].hasOwnProperty(key))
		                arguments[0][key] = arguments[i][key];
		    			return arguments[0];
		}
	};
	var widgets = {
		Tooltip: function () {
			var _el = this.el;
			_el = Array.prototype.slice.call(_el);

			var TooltipConstructor = function () {
				var tooltipText = this.getAttribute('data-rsktitle');
			}

			_el.forEach(function (el, i) {
				return TooltipConstructor.call(el);
			});
		},

		Progressbar: function (opts) {
			var _el = this.el,
			callbackRan = false;
			//_el = Array.prototype.slice.call(_el);

			var settings = {
				onDone: null,
				startValue: 0,
				label: false
			}

			settings = tools.extend(settings, opts);

			var ProgressbarConstructor = function () {
				_el = Array.prototype.slice.call(_el);
				var innerProgressbar = document.createElement('div'),
				label 				 = document.createElement('div');
				innerProgressbar.className="rsk_inner_bar";
				innerProgressbar.style.width = settings.startValue+'%';
				label.className="rsk_progress_label";
				_el.forEach(function (el, i) {
					el.className += " rsk_progress";
					el.appendChild(innerProgressbar);
					if(settings.label) {
						el.appendChild(label);
					}
				});
			}

			ProgressbarConstructor.prototype.setProgress = function (progress) {
				if(progress <= 100 && progress >= 0) {
					_el.forEach(function (el, i) {
						//First element of course
						if(settings.label) {
							el.getElementsByClassName('rsk_progress_label')[0].innerHTML = Math.round(progress)+'%';
						}
						el.getElementsByClassName('rsk_inner_bar')[0].style.width = progress+'%';
					});
				}
				if(progress >= 100 && !callbackRan) {
					if(settings.onDone) {
						settings.onDone();
						callbackRan = true;
					}
				}
			};

			ProgressbarConstructor.prototype.done = function (callback) {
				if(callback) {
					callback();
				}
			};

			return new ProgressbarConstructor;
		},

		Radiobutton: function () {
			var _el = this.el;
			_el = Array.prototype.slice.call(_el);

			var RadiobuttonConstructor = function () {
				var checkboxwrap, checkbox,
				originalCheckbox = this,
				parent = originalCheckbox.parentNode;

				checkboxwrap = document.createElement('div');
				checkboxwrap.className="rsk_radiobutton_wrap"

				checkbox = document.createElement('div');
				checkbox.className="rsk_radiobutton";
				checkbox.setAttribute('data-checked', false);

				parent.replaceChild(checkboxwrap, originalCheckbox);
				checkboxwrap.appendChild(originalCheckbox);
				checkboxwrap.appendChild(checkbox);

				checkbox.addEventListener('rsk_remove', function () {
					this.setAttribute('data-checked', 'false');
				}, false);

				checkbox.addEventListener('click', function () {
					//console.log(this.getAttribute('data-checked'))
					if(this.getAttribute('data-checked') != "true") {
						var children = parent.getElementsByClassName(this.className);
						var i = 0;
						while(i < children.length) {
							children[i].setAttribute('data-checked', false);
							i++;
						}

						originalCheckbox.checked = true;
						this.setAttribute('data-checked', true);
					}
				}, false);
			}

			_el.forEach(function (el, i) {
				return RadiobuttonConstructor.call(el);
			});	
		},

		Checkbox: function (opts) {
			var _el = this.el;
			_el = Array.prototype.slice.call(_el);

			var settings = {
				onSelect: false
			}
			settings = tools.extend(settings, opts);

			var CheckboxConstructor = function () {
				var checkboxwrap, checkbox,
				originalCheckbox = this,
				parent = originalCheckbox.parentNode;

				checkboxwrap = document.createElement('div');
				checkboxwrap.className="rsk_checkbox_wrap"

				checkbox = document.createElement('div');
				checkbox.className="rsk_checkbox";

				checkbox.setAttribute('data-checked', false);
				if(originalCheckbox.checked) {
					checkbox.setAttribute('data-checked', true);
				}

				parent.replaceChild(checkboxwrap, originalCheckbox);
				checkboxwrap.appendChild(originalCheckbox);
				checkboxwrap.appendChild(checkbox);

				originalCheckbox.addEventListener('click', function () {
					if(this.checked) {
						checkbox.setAttribute('data-checked', true);
					} else {
						checkbox.setAttribute('data-checked', false);
					}
				}, false)

				if(settings.onSelect) {

				} else {
					checkbox.addEventListener('click', function (e) {
						if(this.getAttribute('data-checked') == "true") {
							originalCheckbox.checked = false;
							this.setAttribute('data-checked', false);
						} else {
							originalCheckbox.checked = true;
							this.setAttribute('data-checked', true);
						}
					}, false);
				}
			};

			_el.forEach(function (el, i) {
				return CheckboxConstructor.call(el);
			});
		},

		Lightbox: function (opts) {
			var _el = this.el;

			var settings = {
				html: 'Mangler innhold'
			};

			settings = tools.extend(settings, opts);

			var LightboxConstructor = function () {
				var haze, maindiv, close, th = this;
				haze = document.createElement('div');
				haze.className="lightboxHaze";

				maindiv = document.createElement('div');
				maindiv.className = "lightbox";
				maindiv.innerHTML = settings.html;

				close = document.createElement('div');
				close.className = "close";
				close.addEventListener('click', function () {
					th.close();
				}, false);
				maindiv.appendChild(close);

				haze.appendChild(maindiv);

				this.html = haze;

				if(settings.callback) {
					settings.callback(this.html);
				}

			};
			LightboxConstructor.prototype.open = function () {
				_el[0].appendChild(this.html);
			};
			LightboxConstructor.prototype.close = function () {
				if(settings.onBeforeClose) {
					settings.onBeforeClose();
				}
				_el[0].removeChild(this.html);
				if(settings.onClose) {
					settings.onClose();
				}
			};

			return new LightboxConstructor;
		},

		Slider: function (opts) {
			var _el = Array.prototype.slice.call(this.el);

			var settings = {
				range: false,
				max: 100,
				min: 0,
				values: [this.min, this.max]
			};
			settings = tools.extend(settings, opts);

			var SliderHandle = function (val) {
				var th = this;
				th.start = settings.values[0];
				th.delta;
				th.slidemax;
				th.handle = document.createElement('div');
				th.handle.setAttribute('data-val', val);
				th.handle.className="rsk_slider_handle";
				th.handle.style.left = val+'%';

				var move = function (e) {
					th.mousemove(e);
				}
				th.handle.addEventListener('mousedown', function (e) {
					th.start = parseInt(th.handle.getAttribute('data-val'));
					window.addEventListener('mousemove', move, false);
				}, false);

				window.addEventListener('mouseup', function (e) {
					window.removeEventListener('mousemove', move);
				});
			};
			SliderHandle.prototype.mousemove = function (e) {
				var th = this;
					console.log(th.handle.parentNode.offsetWidth/(e.clientX-th.handle.parentNode.offsetLeft)*100);return
					th.delta = (e.clientX/th.handle.parentNode.offsetLeft) - th.start;
					//console.log(th.delta);
					//th.delta = e.clientX - th.handle.getAttribute('data-val');

					if(th.start+th.delta < 0) {
						start = 0;
					} else if(th.start+th.delta > th.slidemax) {
						th.start = th.slidemax;
					} else {
						th.start = th.start+th.delta;
					}
					th.handle.setAttribute('data-val', th.start);
					th.handle.style.left = th.start+'%';
					
			};
			SliderHandle.prototype.render = function () {
				return this.handle;
			};

			var SliderConstructor = function () {
				var sliderwrap,
				sliderrail,
				sliderhandle,
				parent = this.parentNode,
				originalSlider = this;

				sliderwrap = document.createElement('div');
				sliderwrap.className = "rsk_slider_wrap";
				sliderrail = document.createElement('div');
				sliderrail.className = "rsk_slider_rail";

				sliderhandle = new SliderHandle(settings.values[0]);
				/*
				sliderhandle = document.createElement('div');
				sliderhandle.setAttribute('data-val', settings.min);
				sliderhandle.className="rsk_slider_handle";*/
				//sliderwrap.appendChild(sliderrail);
				
				//EVENTS
				//console.log(settings.values[0])
				/*
				var start = settings.values[0], 
					delta, 
					slidemax;
				var mousemove = function (e) {
					//delta = e.clientX - start;
					delta = (e.clientX-sliderwrap.offsetLeft) - start;
					console.log(start)
					
					
					//Something fishy going on with delta
					if(start+delta < 0) {
						start = 0;
					} else if(start+delta > slidemax) {
						start = slidemax;
					} else {
						start = start+delta;
					}	
					/*				
					sliderhandle.setAttribute('data-val', start);
					sliderhandle.style.left = start+'px';
					*/
					
				//}

				/*
				sliderhandle.addEventListener('mousedown', function (e) {
					start = parseInt(sliderhandle.getAttribute('data-val'));
					window.addEventListener('mousemove', mousemove, false);
				}, false);
				*/
				//EVENTS SLUTT

				parent.replaceChild(sliderwrap, originalSlider);
				sliderwrap.appendChild(originalSlider);
				sliderwrap.appendChild(sliderrail);
				sliderwrap.appendChild(sliderhandle.render());

				//sliderhandle.slidemax = sliderwrap.offsetWidth;
				sliderhandle.slidemax = settings.max;

				if(settings.range) {
					var sliderhandle2 = new SliderHandle(settings.values[1]);
					sliderhandle2.handle.setAttribute('data-val', settings.values[1]);
					sliderhandle2.slidemax = sliderwrap.offsetWidth;
					sliderwrap.appendChild(sliderhandle2.render());
				}
			}

			_el.forEach(function (el, i) {
				SliderConstructor.call(el);
			});
		},

		Dropdown: function (opts) {
			var _el = this.el;
			_el = Array.prototype.slice.call(_el);

			
			var settings = {
				onInit: null,
				onSelect: null,
				onShow: null,
				height: null,
				multiple: false
			}
			settings = tools.extend(settings, opts);

			var DropdownConstructor = function () {

				var visible = 0,
					button,
					values = [],
					i = 0,
					options,
					option,
					optionValue,
					optionText,
					select,
					list,
					chevron,
					selectwrap,
					selectfieldwrap,
					dropheight = 0,
					th = this;

				var methods = {
					slideToggle: function () {
						var parent = th.parentNode;
						console.log(parent)
						if(visible) {
							//hide
							visible = 0;
							parent.getElementsByClassName('dropdown_list')[0].style.height = '0';
							parent.getElementsByClassName('rsk_chevron')[0].className = "rsk_chevron rsk_chevrondown";
							parent.removeEventListener('transitionend', settings.onShow);
						} else {
							//show
							visible = 1;
							parent.getElementsByClassName('dropdown_list')[0].style.height = dropheight+'px';
							parent.getElementsByClassName('rsk_chevron')[0].className = "rsk_chevron rsk_chevronup";

							parent.addEventListener('transitionend', settings.onShow, false);
						}
					},
					hide: function () {
						var parent = th.parentNode;
						visible = 0;
						parent.getElementsByClassName('dropdown_list')[0].style.height = '0';
						parent.getElementsByClassName('rsk_chevron')[0].className = "rsk_chevron rsk_chevrondown";
					}
				}

				options = this.getElementsByTagName('option');

				selectwrap = document.createElement('div');
				selectwrap.className="rsk_dropdownWrap";

				selectfieldwrap = document.createElement('div');
				selectfieldwrap.className = "rsk_selectfieldwrap";

				chevron = document.createElement('div');
				chevron.className = "rsk_chevron rsk_chevrondown";

				select = document.createElement('div');
				select.className="rsk_basic select";
				select.innerHTML = this.options[this.selectedIndex].text;
				selectfieldwrap.appendChild(chevron);
				selectfieldwrap.addEventListener('click', function () {
					methods.slideToggle();
				}, false);

				selectfieldwrap.appendChild(select)

				selectwrap.appendChild(selectfieldwrap);

				list = document.createElement('div');
				list.className="dropdown_list";

				/*
				select.addEventListener('click', function (e) {
					//e.stopPropagation();
					th.slideToggle();
					console.log('hæ')
				}, false);
				w.addEventListener('click', function () {
					th.hide();
				}, true);
				*/

				if(settings.multiple) {
					this.multiple = true;
				}

				for(i; i < options.length; i++) {
					optionValue = options[i].value;
					optionText  = options[i].innerHTML;
					option = document.createElement('div');
					option.setAttribute('data-value', optionValue);
					
					if(settings.multiple && i > 0) {
						option.innerHTML = '<div class="checkboxwrap"><input type="checkbox" class="checkbox" /></div><div class="value">'+optionText+'</div>';
					} else {
						option.innerHTML = optionText;
					}

					if(settings.onSelect) {
						option.addEventListener('click', function (e) {
							var th = this;
							settings.onSelect({evt: e, option: th, methods: methods});
						});
					} else {
						option.addEventListener('click', function (e) {
							this.value = this.getAttribute('data-value');
							select.innerHTML = this.innerHTML;
							methods.slideToggle();
						}, false);
					}
					list.appendChild(option);
				}
				
				selectwrap.appendChild(list);
				th.el = selectwrap;

				//Replace
				var parent = this.parentNode;
				parent.removeChild(this);
				selectwrap.appendChild(this);

				this.style.display = "none";
				parent.appendChild(selectwrap);				
				
				//Determine height and hide it
				dropheight = list.clientHeight;
				if(settings.height) {
					dropheight = settings.height;
				}
				
				list.style.height = 0;


				if(settings.onInit) {
					settings.onInit();
				}
			};

			//return new DropdownConstructor;
			_el.forEach(function (el, i) {
				return DropdownConstructor.call(el);
			});
		}
	};

	var RskConstructor = function (el) {
		if(el) {
			this.el = document.querySelectorAll(el);
		}
	}
	RskConstructor.prototype.widget = function (name, options) {
		//Fyr opp widget på elementet
		return widgets[name].call(this, options);
	}

	window.RSK = function (el) {
	 	return new RskConstructor(el);
	}

}(window, document, undefined));

//Brukes
/*
	RSK('.bajnskap').widget('lightbox', {});

*/