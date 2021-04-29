$(document).ready(function() {
  
    
	
    //Increases width of main content if there is no SPIF
    if($.trim($(".three.columns.right-sidebar").html())=='') {
	    $(".nine.columns.department-content").css({"width": "100%"});
    }
	
	/*  -----------------------------------------
		PLUGIN JS
	 ----------------------------------------- */
	
	/* Slider ------------ */
	
    $('.slideshow:not(.interior-banner)').orbit({ 
    	bullets: 'true',
    	captions: 'true',
        pauseOnHover: 'true',
        startClockOnMouseOut: true,
        advanceSpeed: 4500
    });
 
    $('.slideshow-news:not(.interior-banner)').orbit({ 
    	bullets: false,
    	captions: true,
        pauseOnHover: true,
        startClockOnMouseOut: true,
        advanceSpeed: 4500
    });

    $('.slideshow .slide-content ').show();
    $('.slideshow-news .slide-content ').show();  
  
    $('div.slider-nav').removeClass('hide-for-small');     //this is to make sliders visible on mobile
  
    	
	
	/*  -----------------------------------------
		CUSTOM JS
	 ----------------------------------------- */
	 
		
	/* News Template Adjustment ------------ */
	
	// Check Template 
	if ($('.template-news').is('*')) {
		
		// If image in News Article, change item display
		$('.featured-news-articles .callout-col a img').each(function() {
			
			// Add some classes
			$(this).parent().parent().find('.callout-col-title').addClass('has-image');
			$(this).parent().parent().find('.callout-col-exerpt').addClass('has-image-desc');				
			
		});
		
		// Set heights of columns
		var maxHeight = -1;

   		$('.has-image-desc').each(function() {
   		  maxHeight = maxHeight > $(this).height() ? maxHeight : $(this).height();
   		  maxHeight = parseInt(maxHeight) + 10;
   		  
   		});
   		
   		$('.has-image-desc').each(function() {
   		  $(this).height(maxHeight);
   		});
	
	}
	
	
	/* Departement Template Adjustment ------------ */
    console.log("Here") ;
    if ($('.template-department').is('*')) { 
		console.log("is .template-department") ;
		// Apply class dependent on number of nav items (6 or 7)
		var nav_size = $('.default-nav').size();
     		
		if (nav_size == 6) {
			$('.template-department').addClass('department-6-nav-items');
		}
		
		if (nav_size == 7) {
			$('.template-department').addClass('department-7-nav-items');
		}
		
    }
    
	
	/* Main Navigation Adjustment ------------ */

	// Equal Height UL's
	var maxHeightUl = -1;
	
	$('.default-nav ul').each(function() {
	  maxHeightUl = maxHeightUl > $(this).height() ? maxHeightUl : $(this).height();
	});
	  maxHeightUl = parseInt(maxHeightUl) + 15;  
	
	//alert(maxHeightUl);
	
	$('.default-nav ul').each(function() {
	    $(this).height(maxHeightUl);
	});	
	    	
//if there are no nav items don't animate
if (maxHeightUl>15) {

	// If iPad
	if ($('.touch').is('*')) { 
	    
	    // Slide down Menu
	    var slideHeight = maxHeightUl + 40;
	    $('.default-nav a').click(function() {	
	    	var rowHeight = $('.row-drop').height();
	    	
	    	if (rowHeight == 40) {
	    		$('.row-drop').animate({"height":slideHeight});
	    	}
	    	else {
	    		$('.row-drop').animate({"height":40});
	    	}
	    	
	    });
	    
	}
	
	// If Large Display
	else {
	    
	    // Slide down Menu
		var slideHeight = maxHeightUl + 40;
	    $('.default-nav').mouseenter(function() {	
			$('.row-drop').stop().animate({"height":slideHeight} );
	   	});
	    
	    // Slide up menu
	    $('.row-drop').mouseleave(function() {
	    	$('.row-drop').stop().animate({"height":40});
	    })
	    
	}
    	
}
	/* Left Navigation Adjustment ------------ */
	
	if ($('.mobile-left-nav').is('*')) { 
	
		$('.left-sidebar .side-nav').clone().appendTo('.mobile-left-nav ul li');
		
		$('.mobile-left-nav').find('li a.parent').live("click", function() {
			$('.mobile-left-nav ul ul').toggle();
			return false;
		});
		
	}
	
  //  $('.three.columns.left-sidebar ul.twelve.side-nav').clone().appendTo('div.navigationPopUp.no-drop ul'); //Grabs the side-menu and clones it to the mobile drop down menu
  
   
  /* copies side-menu into mobile nav bar and deletes the standard nav bar ONLY if a side-menu bar exists */
  if ($('.three.columns.left-sidebar').is('*')) {
               $('div.navigationPopUp.no-drop ul').empty(); 
               $('.three.columns.left-sidebar ul.twelve.side-nav').clone().appendTo('div.navigationPopUp.no-drop ul');
           }
           
	
	/* Universal Template Adjustment ------------ */
	
	// Table Add Class for alt colors
	$('.fancy-table .table-col').not(':first-child').each(function(){
		$(this).find('li:odd').addClass('gray');
	});
	
	
	
	/* Footer Social Icon  ------------ */
     
	$('.icons img').hover(function(){
		 $(this).stop().animate({opacity: "0.8"});
	},function(){
		 $(this).stop().animate({opacity: "1"});
	});
	
	
	
	/* Mobile Menu ------------ */

		$('.mobile-menu h3.hasDrop ').click(function(e) {


		 var link = $(this); //preselect the link
         if (link.hasClass('activehover')) { 
          return true;  //if dropdown bar is already triggered, process the link
        } else {
          $('.navigationPopUp:visible').stop().slideUp('fast'); //bring up the dropdown bar and prevent default link from firing
		$('div').removeClass('activeHover');
		if($(this).parent('.columns').find('.navigationPopUp').is(':hidden')) {
			$(this).parent('div').addClass('activeHover');
			$(this).parent('.columns').find('.navigationPopUp').stop().slideDown('fast');
		}
          //link.addClass('activehover');
          $('.mobile-menu h3.hasDrop').not(this).removeClass('activehover');
          e.preventDefault();
          return false; //extra, and to make sure the function has consistent return points
         }

	});

	// If clicked outside of H3 hide menu
	if( /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent) ) {
		
		// Hide on any other click
		$("body").click(function(event) {
			var clicked = event.target.nodeName;
			if (clicked != 'H3') {
				$('.navigationPopUp:visible').stop().slideUp('fast');
				$('div').removeClass('activeHover');
			}
		});
		
		// If Scrolled Hide Menu
		var $document = $(document),
		className = 'hasScrolled';
		
		$document.scroll(function() {
			if ($document.scrollTop() >= 5) {
				$('.navigationPopUp:visible').stop().slideUp('fast');
				$('div').removeClass('activeHover');
			}
		});
		
	}
  
  	/** Added by T4 - Randomizes banner image displayed on Landing, Universal and News Landing page layouts. ------------ */
  	var banner_ims = $('.interior-banner img') ;
	banner_ims.eq(Math.floor(Math.random() * banner_ims.length)).css('display', 'block') ;
	
	/** Added by T4 - randomizes the display of multi-purpose SPIFs in the left-hand column of Universal page layout */
	var mpSpifs = $('.multipurpose-spif') ;
	var length = mpSpifs.length ;
	if (length > 1) {
		mpSpifs.css('display', 'none') ;
		var numb = Math.floor(Math.random() * length) ;
		mpSpifs.eq(numb).css('display', 'block') ;
	}
  
	/** Added by T4 - randomizes the display of SPIFs homepage */
	var spifs = $('.spif').not('.moveable-widgets .spif') ; //standard spifs
	var length = spifs.length ;
	if (length > 2) {
		spifs.css('display', 'none') ;
		var count = 4 ; //number of spifs to display set 4 as default
		if ($('.banner-area').find('img').length > 0) {
			var count = 2 ;	//if there is a banner spif show 2 standard spifs
		} 
		var randoms = [] ; //random numbers used
		for (var i = 0; i < count; i++) {
			var number = Math.floor(Math.random() * length) ;
			while (randoms.indexOf(number) != -1) {
				number = Math.floor(Math.random() * length) ;
			}
			spifs.eq(number).css('display', 'block') ;		
			randoms[i] = number ;
		}
	}

	/** Does the same for lower portion of department inner page layout */
	spifs = $('.template-department .content-cols > .spif').not('.moveable-widgets .spif, .moveable-widgets-heavy .spif') ;
	length = spifs.length ;
	if (length > 2) {
		spifs.css('display', 'none') ;
		var numb = Math.floor(Math.random() * length) ;
		spifs.eq(numb).css('display', 'block') ;
		var numbB = Math.floor(Math.random() * length)  ;
		while (numbB == numb) {
			numbB = Math.floor(Math.random() * length) ;
		}
		spifs.eq(numbB).css('display', 'block') ;
	}

//department page heavy and light - only show the first 4 boxes in the bottom bar
$('.moveable-widgets .three:gt(3)').hide();
$('.moveable-widgets-heavy .four:gt(2)').hide();


	/** Does the same for  SPIFs in RHS of department inner page layout */
	spifs = $('.template-department .right-sidebar .spif') ;
	length = spifs.length ;
	if (length > 1) {
		spifs.css('display', 'none') ;
		var numb = Math.floor(Math.random() * length) ;
		spifs.eq(numb).css('display', 'block') ;
	}

  	/** Added by T4 - Adds class .current to last li in .breadcrumbs ------------ */
  	$('.breadcrumbs li').last().addClass('current') ;
  	/** Added by T4 - Adds active class to appropriate <li> in contextual nav (lhs) in Universal and Landing page layouts */
  	var lastSpan = $('ul.side-nav.twelve').find('span').last().parent('li').addClass('active') ;
  	
});

 


$(document).ready(function(){
	$('#google-search').submit(function() {
		var storedSearches = [];
		if (localStorage["recentSearches"]!=null) {
			storedSearches = JSON.parse(localStorage["recentSearches"]);
		}
		var numberToStore = 2;
		var recentSearches = [];
	
		recentSearches[0] = $('#q').val();

		var i;
		for (i = 0; i <= storedSearches.length; ++i) {
			recentSearches[i+1] = storedSearches[i]
			if (i==(numberToStore-1)) {
				break;
			}
		}		

		localStorage["recentSearches"] = JSON.stringify(recentSearches);

	});
});


//retrieve recent searches
jQuery(function($){
	$(document).ready(function(){
		if (localStorage["recentSearches"]==null) {
			$('ul.recent-searches').append('<li>No Recent Searches to Display</li>');				
		} else {
			var storedSearches = JSON.parse(localStorage["recentSearches"]);

			$('ul.recent-searches').append('<li>Recent Searches</li>');				

			var i;
			for (i = 0; i < storedSearches.length; ++i) {
				if (storedSearches[i]!=null) {
					$('ul.recent-searches').append('<li><a href="/search/?cx=012262039649231487241%3Agvujb-wcge0&q=' + storedSearches[i] + '">' + storedSearches[i] + '</a></li>');	
				}
			}		
		}
	});
});


/*****BEGIN TRACKING CODE FUNCTIONS*****/
function recordOutboundLink(link, category, action, label) {
		_gaq.push(['_trackEvent', category, action, label]);
    /*setTimeout('document.location = "' + link.href + '"', 100);*/
}
/*****END TRACKING CODE FUNCTIONS*****/

/******* attach analytics tracking *******/
jQuery(function($){
	$(document).ready(function(){

		/*******  to home carousel *******/
		$('.template-home .slider-nav .left').click(function(){
		_gaq.push(['_trackEvent', 'Home Carousel', 'Arrow Click', 'Left']);
		});

		$('.template-home .slider-nav .right').click(function(){
		_gaq.push(['_trackEvent', 'Home Carousel', 'Arrow Click', 'Right']);
		});

		$('.template-home .slide-content .read-more a').click(function(){
		//_gaq.push(['_trackEvent', 'Home Carousel', 'Story Click', $('.slide-content h3:visible').text()]);
                _gaq.push(['_trackEvent', 'Home Carousel', 'Story Click', $(this).parents('.slide-content').find('h3').text() ]);
                  
		});

		/*******  to news carousel *******/
		$('.template-news .slider-nav .left').click(function(){
		_gaq.push(['_trackEvent', 'News Carousel', 'Arrow Click', 'Left']);
		});

		$('.template-news .slider-nav .right').click(function(){
		_gaq.push(['_trackEvent', 'News Carousel', 'Arrow Click', 'Right']);
		});

		$('.template-news .slide-content .read-more a').click(function(){
		_gaq.push(['_trackEvent', 'News Carousel', 'Story Click', $('.slide-content h3:visible').text()]);
		});

		/*******  to social tabs *******/
		$('.social-tabs .tabs a').click(function(){
		_gaq.push(['_trackEvent', 'Social Tabs', 'Click', $(this).text()]);
		});

        	/*******  footer social clicks *******/
		$('.footer .social a').click(function(){
		_gaq.push(['_trackEvent', 'Social Footer', 'Click', $(this).children('img').attr('alt') ]);
		});

        	/*******  event/calendar clicks *******/
		$('.event .event-title a').click(function(){
		_gaq.push(['_trackEvent', 'Calendar Event Title', 'Click' ]);
		});

		/*******  to SPIFs *******/
		$('.spif a').click(function(){
		_gaq.push(['_trackEvent', 'SPIF Click', $(this).parents('.spif').find('.callout-col-exerpt .title a').text(), $(location).attr('href')]);
		});
          
              /* Example:  _trackEvent(category, action, opt_label, opt_value)  */
    /* _trackEvent('footer','action???',this.title,'optional value'); */
    /* Sample to add tracking to every anchor within a "sample" class section. */
    /*
    $('.sample a').click(function() {
        currentTitle=$(this).text();
        currentPath=$(this).attr('href');
        recordOutboundLink(this, category, action, title);
    });
    */
   
   /*File Types*/
    var filetypes = /\.(zip|exe|pdf|doc*|xls*|ppt*|mp3)$/i;
   
    $('a').each(function(){
        var href = $(this).attr('href');
      if (href != undefined) {
          /*Adds a "tracking" class to external links*/
          if ((href.match(/^https?\:/i)) && (!href.match(document.domain))){
              $(this).addClass('tracking');
              $(this).addClass('externalLink');
          }
          /*Adds a "tracking" class to mailto links*/
          else if (href.match(/^mailto\:/i)){
              $(this).addClass('tracking');
              $(this).addClass('mailLink');
          }
	        /*Adds a "tracking" class to files*/
          else if (href.match(filetypes)){
              $(this).addClass('tracking');
              $(this).addClass('download');
          }
    	}
    });
    /* Adds an onclick event to every anchor node with a class of "tracking". */
    $('a.tracking').click(function() {
        var currentTitle="No Title";
        var currentCategory="No Category";
        var currentPath=$(this).attr('href');
        /*Begin: Set the title value*/
            if ($(this).attr('title')){currentTitle=$(this).attr('title');}
            else if ($(this).text()){currentTitle=$(this).text();}
            else if ($(this).children('img').attr('title')){currentTitle=$(this).children('img').attr('title');}
            else if ($(this).children('img').attr('alt')){currentTitle=$(this).children('img').attr('alt');}
            else if ($(this).children('img').attr('src')){currentTitle=$(this).children('img').attr('src');}
            else {currentTitle=$(this).attr('href');}
        /*End: Set the title value*/
        /*Begin set category*/
            if ($(this).hasClass('externalLink')){currentCategory='External Link';}
            else if ($(this).hasClass('mailLink')){currentCategory='Mail Link';}
            else if ($(this).hasClass('download')){currentCategory='Download';}
            else {currentCategory='Internal Link';}
        /*End set category*/
        /*confirm("Tracking: Title-"+currentTitle+" Path-"+currentPath);*/
        recordOutboundLink(this, currentCategory, currentPath, currentTitle);
    });

	});
  
   /*** set the slider height to be smaller if viewing on small screen ***/
    console.log($(window).width());
    if ($(window).width() < 750) {
        var test =  $('div').find('.orbit-wrapper');
        console.log(test);
        test.height(185);
      $('.orbit-slide').find('h3, .slide-desc').css("display" , "none");
        console.log("my edit was accepted");
      $('.six.columns.banner-area').css('margin-top', 'auto').css('margin-left', 'auto');
      $('.orbit-wrapper').css('display', 'flex');
      $('div').find('.slideshow.orbit.with-bullets').removeClass('hide-for-small');
      }
 
  
});