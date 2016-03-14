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
				onReady: null,
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
				if(settings.onReady) {
					settings.onReady.call(this);
				}
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

		Radiobutton: function (opts) {
			var _el = this.el;
			_el = Array.prototype.slice.call(_el);

			var settings = {
				onSelect: false
			}
			settings = tools.extend(settings, opts);

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

				if(originalCheckbox.checked) {
					checkbox.setAttribute('data-checked', true);
				}

				if(settings.onSelect || settings.afterSelect) {
					var th = this;

						checkbox.addEventListener('click', function () {
							
							if(settings.onSelect) {
								settings.onSelect(th);
							}
							if(this.getAttribute('data-checked') != "true") {
								var children = parent.getElementsByClassName(this.className);
								var i = 0;
								console.log(children)
								while(i < children.length) {
									children[i].setAttribute('data-checked', false);
									i++;
								}
								originalCheckbox.checked = true;
								this.setAttribute('data-checked', true);
								if(settings.afterSelect) {
									settings.afterSelect(th);
								}
							}
						}, false);
				} else {
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


				var th = this;
			
				if(settings.onSelect || settings.afterSelect) {
					//Dersom man håndterer select med callback
					checkbox.addEventListener('click', function (e) {
						if(settings.onSelect) {
							settings.onSelect(th);
						}
						if(this.getAttribute('data-checked') == "true") {
							originalCheckbox.checked = false;
							this.setAttribute('data-checked', false);
						} else {
							originalCheckbox.checked = true;
							this.setAttribute('data-checked', true);
						}
						if(settings.afterSelect) {
							settings.afterSelect(th);
						}
					}, false);
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
				haze.className = "lightboxHaze";

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

		Dropdown: function (opts) {
			var _el = this.el;
			_el = Array.prototype.slice.call(_el);

			
			var settings = {
				onInit: null,
				onSelect: null,
				onShow: null,
				onChange: null,
				afterSelect: null,
				height: null,
				multiple: false,
				disabled: false
			}
			settings = tools.extend(settings, opts);

			var DropdownConstructor = function () {
				this.settings = settings;
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
						if(visible) {
							//hide
							visible = 0;
							parent.getElementsByClassName('rsk_selectfieldwrap')[0].className = parent.getElementsByClassName('rsk_selectfieldwrap')[0].className.replace('active', '');
							parent.getElementsByClassName('dropdown_list')[0].style.height = '0';
							parent.getElementsByClassName('rsk_chevron')[0].className = "rsk_chevron rsk_chevrondown";
							parent.removeEventListener('transitionend', settings.onShow);
						} else {
							//show
							visible = 1;
							parent.getElementsByClassName('rsk_selectfieldwrap')[0].className += " active";
							parent.getElementsByClassName('dropdown_list')[0].style.height = dropheight+'px';
							parent.getElementsByClassName('rsk_chevron')[0].className = "rsk_chevron rsk_chevronup";
							parent.addEventListener('transitionend', settings.onShow, false);
						}
					},
					hide: function () {
						var parent = th.parentNode;
						visible = 0;
						parent.getElementsByClassName('rsk_selectfieldwrap')[0].className = parent.getElementsByClassName('rsk_selectfieldwrap')[0].className.replace('active', '');
						parent.getElementsByClassName('dropdown_list')[0].style.height = '0';
						parent.getElementsByClassName('rsk_chevron')[0].className = "rsk_chevron rsk_chevrondown";
						parent.removeEventListener('transitionend', settings.onShow);
					},
					setOptions: function () {
						var list = document.createElement('div');
						list.className="dropdown_list";

						for(i = 1; i < th.options.length; i++) {
							optionValue = th.options[i].value;
							optionText  = th.options[i].innerHTML;
							option = document.createElement('div');
							option.setAttribute('data-value', optionValue);
							option.setAttribute('data-index', i);
							
							if(settings.multiple && i > 0) {
								option.innerHTML = '<div class="checkboxwrap"><input type="checkbox" class="checkbox" /></div><div class="value">'+optionText+'</div>';
							} else {
								option.innerHTML = optionText;
							}

							if(settings.onSelect && settings.multiple) {
								option.addEventListener('click', function (e) {
									e.stopPropagation();
									if(th.options[this.getAttribute('data-index')].getAttribute('selected') !== 'true') {
										th.options[this.getAttribute('data-index')].setAttribute('selected', 'true');
									} else {
										th.options[this.getAttribute('data-index')].removeAttribute('selected');
									}
									
									settings.onSelect({evt: e, option: this, methods: methods});
								});
							} else if(settings.onSelect && !settings.multiple) {
								option.addEventListener('click', function (e) {
									e.stopPropagation();
									this.value = this.getAttribute('data-value');
									th.value = this.getAttribute('data-value');
									select.innerHTML = this.innerHTML;
									methods.slideToggle();

									settings.onSelect({evt: e, option: this, methods: methods});
								}, false);
							} else {
								option.addEventListener('click', function (e) {
									e.stopPropagation();
									this.value = this.getAttribute('data-value');
									th.value = this.getAttribute('data-value');
									select.innerHTML = this.innerHTML;
									methods.slideToggle();
								}, false);
							}

							list.appendChild(option);
						}
						return list;
					}
				}

				//options = this.getElementsByTagName('option');

				selectwrap = document.createElement('div');
				selectwrap.className="rsk_dropdownWrap";
				if(settings.disabled) {
					selectwrap.className="rsk_dropdownWrap disabled";
				}
				selectwrap.setAttribute('data-name', this.name);

				selectfieldwrap = document.createElement('div');
				selectfieldwrap.className = "rsk_selectfieldwrap";

				chevron = document.createElement('div');
				chevron.className = "rsk_chevron rsk_chevrondown";

				select = document.createElement('div');
				select.className="rsk_basic select";
				select.innerHTML = this.options[this.selectedIndex].text;
				selectfieldwrap.appendChild(chevron);
				selectfieldwrap.addEventListener('click', function (e) {
					e.stopPropagation();
					
					/*
					//Custom shit vett
					if(!$(selectfieldwrap).hasClass('active')) {
						//If not active trigger the others to close
						$(window).trigger('toggle');
					}*/
					methods.slideToggle();
				}, false);

				//Trigger closing when other dropdowns engage
				/*
				$(window).on('toggle', function () {
					if($(th).parents('.rsk_dropdownWrap').find('.active').length > 0) {
						methods.slideToggle();
					}
				}).on('click', function () {
					methods.hide();
				});
				*/

				//Custom shit vett
				/*
				$(this).on('updatelists', function () {
					list = methods.setOptions();
					selectwrap.replaceChild(list, selectwrap.childNodes[1]);

					dropheight = list.clientHeight;
					if(settings.height) {
						dropheight = settings.height;
					}
					
					list.style.height = 0;
				})*/
				
				selectfieldwrap.appendChild(select);
				selectwrap.appendChild(selectfieldwrap);
				if(settings.multiple) {
					this.multiple = true;
				}
				list = methods.setOptions();

				selectwrap.appendChild(list);
				th.el = selectwrap;
				
				//Replace
				var parent = th.parentNode;
				parent.removeChild(th);
				selectwrap.appendChild(th);

				th.style.display = "none";
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
				DropdownConstructor.call(el);
			});
		}
	};

	var GskConstructor = function (el) {
		if(el) {
			this.el = document.querySelectorAll(el);
		}
	}
	GskConstructor.prototype.widget = function (name, options) {
		//Fyr opp widget på elementet
		widgets[name].call(this, options);
	}

	window.GSK = function (el) {
	 	return new GskConstructor(el);
	}

}(window, document, undefined));

//Brukes
/*
	RSK('.bajnskap').widget('lightbox', {});
*/