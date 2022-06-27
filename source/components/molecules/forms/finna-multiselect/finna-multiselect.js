/**
 * Multiselect component.
 *
 * ES6
 *
 * Copyright (C) The National Library of Finland 2022.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 2,
 * as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA
 *
 * @author   Juha Luoma <juha.luoma@helsinki.fi>
 * @license  http://opensource.org/licenses/gpl-2.0.php GNU General Public License
 * @link     https://github.com/NatLibFi/finna-ui-components Github
 */
class MultiSelect extends HTMLElement {

  /**
   * Set entries
   * 
   * @param Object entries
   */
  set entries(entries)
  {
    this.entriesStash = entries;
  }

  /**
   * Get entries
   *
   * @return {Object} entries as an object
   */
  get entries()
  {
    const found = this.getAttribute('entries');
    
    if (!found) {
      return {};
    }

    if (typeof found !== 'object') {
      return JSON.parse(found);
    }
    return found;
  }

  /**
   * Set clear text
   *
   * @param String txt to display
   * 
   * @return void
   */
  set clearText(txt)
  {
    this.setAttribute('clear-text', txt);
  }

  /**
   * Get clear text
   *
   * @return clearText
   */
  get clearText()
  {
    return this.getAttribute('clear-text');
  }

  /**
   * Set label id
   *
   * @param {String} txt to display
   */
  set labelId(txt)
  {
    this.setAttribute('label-id', txt);
  }

  /**
   * Get clear text
   *
   * @return {String}
   */
  get labelId()
  {
    return this.getAttribute('label-id');
  }

  /**
   * Set label id
   *
   * @param {String} txt to display
   */
  set labelText(txt)
  {
    this.setAttribute('label-text', txt);
  }
   
  /**
   * Get clear text
   *
   * @return {String}
   */
  get labelText()
  {
    return this.getAttribute('label-text');
  }

  /**
   * Set label id
   *
   * @param {String} txt to display
   */
  set description(txt)
  {
    this.setAttribute('description', txt);
  }
      
  /**
   * Get clear text
   *
   * @return {String}
   */
  get description()
  {
    return this.getAttribute('description');
  }

  /**
   * Set placeholder
   *
   * @param {String} txt to display
   */
  set placeholder(txt)
  {
    this.setAttribute('placeholder', txt);
  }
         
  /**
   * Get placeholder
   *
   * @return {String}
   */
  get placeholder()
  {
    return this.getAttribute('placeholder');
  }

  /**
   * Set placeholder
   *
   * @param {String} txt to display
   */
  set name(txt)
  {
    this.setAttribute('name', txt);
  }

  /**
   * Get name
   *
   * @return {String}
   */
  get name()
  {
    return this.getAttribute('name');
  }

  /**
   * MultiSelect constructor.
   * 
   * @returns {MultiSelect}
   */
  constructor()
  {
    // Always call super first
    super();

    this.regExp = new RegExp(/[a-öA-Ö0-9-_ ]/);
    this.words = [];
    this.wordCache = [];
    this.active = null;
    this.clicked = false;
    this.levelStep = 10;
  }

  /**
   * When element is added to the dom.
   */
  connectedCallback()
  {
    const fieldSet = document.createElement('fieldset');
    this.append(fieldSet);

    if (!this.id) {
      this.id = `${this.labelId}_fms`;
    }

    if (!this.label) {
      const label = document.createElement('label');
      label.setAttribute('id', this.labelId);
      label.textContent = this.labelText;
      this.label = label;
    }
    fieldSet.append(this.label);

    const select = document.createElement('select');
    select.style.display = 'none';
    select.setAttribute('name', this.name);
    select.setAttribute('multiple', 'multiple');
    this.select = select;
    fieldSet.append(select);

    if (!this.search) {
      const searchForm = document.createElement('input');
      searchForm.classList.add('search');
      searchForm.setAttribute('type', 'text');
      searchForm.setAttribute('role', 'combobox');
      searchForm.setAttribute('placeholder', this.placeholder);
      searchForm.setAttribute('aria-labelledby', this.label.id);
      searchForm.setAttribute('aria-autocomplete', '');
      searchForm.setAttribute('data-active-option', '');
      this.search = searchForm;
    }
    fieldSet.append(this.search);

    const ul = document.createElement('ul');
    ul.classList.add('list');
    ul.setAttribute('aria-label', this.description);
    ul.setAttribute('aria-multiselectable', 'true');
    ul.setAttribute('role', 'listbox');
    ul.setAttribute('aria-activedescendant', '');
    ul.setAttribute('tabindex', '0');
    this.multiSelect = ul;
    fieldSet.append(ul);

    if (!this.clear) {
      const clearButton = document.createElement('button');
      clearButton.classList.add('clear', 'btn', 'btn-link');
      clearButton.textContent = this.clearText;
      this.clear = clearButton;
    }
    fieldSet.append(this.clear);

    this.createSelect();
    this.setEvents();
  }

  /**
   * Create select and multiselect elements.
   */
  createSelect()
  {
    let index = 0;
    let previousLevel = 0;
    let previousElement;
    let currentParent;
    this.entries.forEach((entry) => {
      const innerValue = document.createTextNode(entry.displayText).nodeValue;
      const option = document.createElement('option');
      option.value = document.createTextNode(entry.value).nodeValue;
      option.textContent = innerValue;
      this.select.append(option);
      const multiOption = document.createElement('li');
      multiOption.classList.add('option');
      multiOption.setAttribute('id', `${this.id}_opt_${index++}`);
      multiOption.reference = option;
      const multiOptionP = document.createElement('span');
      multiOptionP.append(innerValue);
      multiOption.append(multiOptionP);
      multiOption.dataset.formatted = innerValue;
      if (entry.selected) {
        option.setAttribute('selected', 'selected');
        multiOption.classList.add('selected');
      }
      multiOption.setAttribute(
        'aria-selected',
        option.getAttribute('selected') === 'selected'
      );
      if ('level' in entry) {
        const level = parseInt(entry.level);
        if (level === 0) {
          this.multiSelect.append(multiOption);
          currentParent = multiOption;
        }
        if (level > previousLevel) {
          const previousClone = previousElement.cloneNode(true);
          previousClone.innerHTML = previousElement.innerHTML;
          previousClone.reference = previousElement.reference;
          previousElement.textContent = '';
          previousElement.removeAttribute('aria-selected');
          previousElement.removeAttribute('id');
          previousElement.classList.remove('option', 'option-child');
          delete previousElement.dataset.formatted;
          previousElement.append(previousClone);

          this.words.pop();
          this.words.push(previousClone);
        } else if (level < previousLevel && level !== 0) {
          currentParent = currentParent.closest('li.option-parent');
        }
        if (level !== 0) {
          if (previousLevel < level) {
            previousElement.classList.add('option-parent');
            previousElement.setAttribute('aria-expanded', 'true');
            previousElement.style.paddingLeft = `0`;
            const group = document.createElement('ul');
            group.classList.add('parent-holder');
            group.setAttribute('role', 'group');
            previousElement.insertAdjacentElement('beforeend', group);
            currentParent = group;
            if (previousLevel === 0) {
              previousElement.classList.add('root');
              group.style.paddingLeft = `${this.levelStep}px`;
            }
          }
          const childLine = document.createElement('div');
          childLine.classList.add('child-line');
          multiOption.insertAdjacentElement('afterbegin', childLine);
          multiOption.classList.add('option-child');
          multiOption.style.paddingLeft = `${this.levelStep * (level)}px`;

          //multiOption.classList.add(`child-width-${level}`);
          currentParent.insertAdjacentElement('beforeend', multiOption);
          childLine.style.width = `${this.levelStep * level}px`;
          childLine.style.left = `0`;
        }
        previousLevel = level;
      } else {
        this.multiSelect.append(multiOption);
      }
      
      this.words.push(multiOption);
      previousElement = multiOption;
    });
  }
  
  /**
   * Assign click and key events.
   */
  setEvents()
  {
    // Record when the user clicks the list element
    this.multiSelect.addEventListener('mousedown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.clicked = true;
      this.multiSelect.focus();
    });

    // Record when the user touches the list element
    this.multiSelect.addEventListener('touchstart', (e) => {
      e.stopPropagation();
      this.clicked = true;
      this.multiSelect.focus();
    }, {passive: true});

    // When the user focuses to the list element
    this.multiSelect.addEventListener('focusin', () => {
      if (this.clicked) {
        this.clicked = false;
        return;
      }

      if (this.active === null) {
        // Focus must be set on the first selected element if found
        const selected
          = this.multiSelect.querySelector('.option.selected:not(.hidden)');
        if (selected) {
          this.setActive(selected);
        } else {
          this.setActive(this.multiSelect.querySelector('.option:not(.hidden)'));
        }
        
        this.scrollList();
      }
    });

    // Add dynamic listener to the list element
    // to check when the user clicks an option
    this.multiSelect.addEventListener('click', (e) => {
      if (!e.target) {
        return;
      }
      const closest = e.target.closest('.option');
      if (closest){
        this.setActive(closest);
        this.setSelected();
      }
    });

    this.multiSelect.addEventListener('focusout', () => {
      this.clicked = false;
      this.clearActives();
      this.clearCaches();
    });

    this.multiSelect.addEventListener('keyup', (e) => {
      e.preventDefault();
      const keyLower = e.key.toLowerCase();
      if (this.regExp.test(keyLower) === false) {
        return;
      }
      if (this.charCache !== keyLower) {
        this.clearCaches();
      }

      const hasActive = this.active
        ? this.active.dataset.formatted[0].toLowerCase() === keyLower
        : false;

      if (this.wordCache.length === 0) {
        this.words.forEach((option) => {
          if (!option.classList.contains('hidden')) {
            const char = option.dataset.formatted[0].toLowerCase();
            if (char === keyLower) {
              this.wordCache.push(option);
            }
          }
        });
      }

      if (this.wordCache.length === 0) {
        return;
      }

      if (hasActive === false) {
        this.clearActives();
        this.setActive(this.wordCache[0]);
        this.scrollList();
      } else {
        let lookFor = this.wordCache.indexOf(this.active) + 1;
        if (lookFor > this.wordCache.length - 1) {
          lookFor = 0;
        }
        const current = this.wordCache[lookFor];
        if (current) {
          this.setActive(current);
          this.scrollList();
        }
      }
      this.charCache = keyLower;

      if (e.key !== 'Enter' && e.key !== ' ') {
        return;
      }

      this.setSelected();
    });
    this.multiSelect.addEventListener('keydown', (e) => {
      if (!['ArrowUp', 'ArrowDown', 'Enter', ' '].includes(e.key)) {
        return;
      }
      e.preventDefault();
      if (['ArrowUp', 'ArrowDown'].includes(e.key)) {
        if (this.charCache) {
          this.clearCaches();
        }
        if (this.wordCache.length === 0) {
          this.words.forEach((option) => {
            if (!option.classList.contains('hidden')) {
              this.wordCache.push(option);
            }
          });
        }
        let direction = (e.key === 'ArrowUp') ? -1 : 1;
        let lookFor = +this.wordCache.indexOf(this.active) + direction;
        if (lookFor > this.wordCache.length - 1) {
          lookFor = 0;
        }
        if (lookFor < 0) {
          lookFor = this.wordCache.length - 1;
        }

        const current = this.wordCache[lookFor];
        if (current) {
          this.setActive(current);
          this.scrollList();
        }
      } else {
        this.setSelected();
      }
    });

    this.clear.addEventListener('click', (e) => {
      e.preventDefault();
      this.words.forEach((option) => {
        option.setAttribute('aria-selected', 'false');
        option.reference.selected = false;
      });
    });

    var searchInterval = false;
    this.search.addEventListener('keyup', () => {
      clearInterval(searchInterval);
      searchInterval = setTimeout(() => {
        if (this.wordCache.length !== 0) {
          this.clearCaches();
        }
        const value = this.search.value.toLowerCase();
        if (value.length === 0) {
          this.words.forEach((option) => {
            option.classList.remove('hidden');
          });
        } else {
          const showParent = (element) => {
            if (!element.classList) {
              return;
            }
            if (element.classList.contains('option-parent')) {
              element.setAttribute('aria-expanded', 'true');
              const child = element.firstChild;
              if (child.classList) {
                child.classList.remove('hidden');
              }
            }
            if (element.classList.contains('root')) {
              return;
            }
            if (element.parentNode
                && this.multiSelect.contains(element.parentNode)
            ) {
              showParent(element.parentNode);
            }
          };
          const parents
            = this.multiSelect.querySelectorAll('.option-parent[aria-expanded]');
          if (parents.length) {
            parents.forEach((parent) => {
              parent.setAttribute('aria-expanded', 'false');
            });
          }
          this.words.forEach((option) => {
            const lookFor = option.dataset.formatted.toLowerCase();
            let matches = String(lookFor).indexOf(value) !== -1;
            option.classList.toggle('hidden', !matches);
            if (matches && option.parentNode) {
              showParent(option.parentNode);
            }
          });
        }
      }, 200);
    });
  }

  /**
   * Set HTMLElement as selected.
   *
   * @param {HTMLElement} element 
   */
  setActive(element) {
    if (!element) {
      return;
    }
    this.clearActives();
    this.active = element;
    this.active.classList.add('active');
    this.search.setAttribute('data-active-option', element.id);
  }

  /**
   * Set active as selected.
   */
  setSelected() {
    const selected = !this.active.reference.selected;
    this.active.reference.selected = selected;
    this.active.setAttribute('aria-selected', selected);
    this.active.classList.toggle('selected', selected);
  }

  /**
   * Clear active selection.
   */
  clearActives() {
    this.search.setAttribute('data-active-option', '');
    if (this.active) {
      this.active.classList.remove('active');
      this.active = null;
    }
  }

  /**
   * Scroll the list.
   */
  scrollList() {
    if (!this.active) {
      return;
    }

    var curtop = 0;
    let obj = this.active;
    while (!obj.classList.contains('list')) {
      curtop += obj.offsetTop;
      obj = obj.offsetParent;
    }
    this.multiSelect.scrollTop = curtop;
  }

  /**
   * Clear the caches.
   */
  clearCaches() {
    this.wordCache = [];
    this.charCache = "";
  }
}

customElements.define('finna-multiselect', MultiSelect);
