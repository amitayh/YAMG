var YAMG = new Class({

    Implements: [Options, Events],

    options: {
        defaultFxOptions: {
            link: false,
            transition: Fx.Transitions.Quint.easeInOut
        },
        bindKeyboardEvents: true,
        width: 560,
        height: 420,
        selectors: {
            images: '.images',
            description: '.description',
            projects: '.project',
            prevProject: '#yamg_prev_project',
            nextProject: '#yamg_next_project'
        }
    },
    
    index: 0,
    projectIndex: 0,

    initialize: function(container, options) {
        this.setOptions(options);
        this.container = $(container).addClass('active');
        this.images = this.container.getElement(this.options.selectors.images);
        this.description = this.container.getElement(this.options.selectors.description);
        this.projects = this.container.getElements(this.options.selectors.projects);
        var defaultFxOptions = $merge(this.options.defaultFxOptions, {property: 'margin-top'});
        this.imagesFx = new Fx.Tween(this.images, $merge(defaultFxOptions, {duration: 750}));
        this.descriptionFx = new Fx.Tween(this.description, $merge(defaultFxOptions, {duration: 1200}));
        this.projectFx = [];
        this.projectImage = [];
        
        this._loadProjects();
        
        this.container.getElement(this.options.selectors.prevProject).addEvent('click', function(e) {
            e.stop();
            this.showPrevProject();
        }.bind(this));
        this.container.getElement(this.options.selectors.nextProject).addEvent('click', function(e) {
            e.stop();
            this.showNextProject();
        }.bind(this));
        
        if (this.options.bindKeyboardEvents) {
            document.addEvent('keydown', function(e) {
                var actions = {
                    up: 'showPrevProject',
                    down: 'showNextProject',
                    left: 'showPrevProjectImage',
                    right: 'showNextProjectImage'
                };
                if (actions[e.key]) {
                    e.stop();
                    this[actions[e.key]]();
                }
            }.bind(this));
        }
    },
    
    showNextProject: function() {
        var next = this._getNext(this.index, this.projects.length);
        if (next != this.index) {
            this.showProject(next);
        }
    },
    
    showPrevProject: function() {
        var prev = this._getPrev(this.index, this.projects.length);
        if (prev != this.index) {
            this.showProject(prev);
        }
    },
    
    showProject: function(index) {
        this.index = index
        var to = -(index * this.options.height);
        this.imagesFx.cancel().start(to);
        this.descriptionFx.cancel().start(to);
    },
    
    showNextProjectImage: function() {
        var next = this._getNext(this.projectIndex, this.projectFx[this.index][1]);
        if (next != this.projectIndex) {
            this.showProjectImage(next);
        }
    },
    
    showPrevProjectImage: function() {
        var prev = this._getPrev(this.projectIndex, this.projectFx[this.index][1]);
        if (prev != this.projectIndex) {
            this.showProjectImage(prev);
        }
    },
    
    showProjectImage: function(index) {
        this.projectIndex = index;
        var projectImage = this.projectImage[this.index];
        if (projectImage) {
            $$(projectImage).removeClass('active');
            projectImage[index].addClass('active');
        }
        var to = -(index * this.options.width);
        this.projectFx[this.index][0].cancel().start(to);
    },
    
    _loadProjects: function() {
        var totalHeight = this.options.height * this.projects.length;
        $$(this.images, this.description).setStyle('height', totalHeight);
            
        this.projects.each(function(project, index) {
            var defaultStyles = {height: this.options.height};
            
            var projectDescription = new Element('div', {styles: defaultStyles});
            var projectDescriptionContainer = project.getElement('.project_description');
            projectDescriptionContainer.inject(projectDescription);
            projectDescription.inject(this.description);
            
            var images = project.getElement('.project_images').getElements('li');
            var totalWidth = this.options.width * images.length;
            var projectImages = new Element('div', {styles: $merge(defaultStyles, {width: totalWidth})});
            var projectFx = new Fx.Tween(
                projectImages,
                $merge(this.options.defaultFxOptions, {
                    property: 'margin-left',
                    duration: 750
                })
            );
            this.projectFx[index] = [projectFx, images.length];
            this.projectImage[index] = [];
            images.each(function(projectImage, i) {
                var projectImageContainer = new Element(
                    'div', {
                        html: projectImage.get('html'),
                        styles: {
                            width: this.options.width,
                            height: this.options.height
                        }
                    })
                    .addClass('project_image')
                    .inject(projectImages);
                
                var projectImageNav = new Element('div', {title: projectImage.get('title')})
                    .addClass('project_image_nav')
                    .addEvent('click', function(index) {
                        this.showProjectImage(index);
                        return false;
                    }.pass(i, this));
                if (!i) {
                    projectImageNav.addClass('active');
                }
                this.projectImage[index].push(projectImageNav);
                projectImageNav.inject(projectDescriptionContainer);
                
            }, this);
            projectImages.inject(this.images);
        }, this);
        this.images.getElements('.project_image a').each(function(el) {
            el.addEvent('click', function(e) {
                e.stop();
                alert(el.get('href'));
            }.bind(this));
        }, this);
    },
    
    _getNext: function(current, max) {
        current++; 
        if (current >= max) {
            // current = 0;
            current = max - 1;
        }
        return current;
    },
    
    _getPrev: function(current, max) {
        current--; 
        if (current < 0) {
            // current = max - 1;
            current = 0;
        }
        return current;
    }

});