(function ($) {
  "use strict";
  // test preloader
  // window.onload = function(){
  //     document.getElementById("preloader-wrap").style.display = "none";
  //     document.getElementById("preloading").style.display = "block";
  // }
  $(window).load(function () {
    $("#loading").fadeOut();
    $("#loading-img").delay(150).fadeOut("slow");
  }),
    4000;

  //===== Preloader
  function handlePreloader() {
    if ($(".loader-wrap").length) {
      $(".loader-wrap").delay(1000).fadeOut(500);
    }
    TweenMax.to($(".loader-wrap .overlay"), 1.2, {
      force3D: true,
      left: "100%",
      ease: Expo.easeInOut,
    });
  }

  if ($(".preloader-close").length) {
    $(".preloader-close").on("click", function () {
      $(".loader-wrap").delay(200).fadeOut(500);
    });
  }

  $(window).on("load", function () {
    handlePreloader();
  });

  $(document).ready(function () {
    $(".nav-pills").waypoint(
      function (direction) {
        $(".nav-pills").addClass("animated fadeInRightBig");
      },
      {
        offset: "100",
      }
    );
  });

  jQuery(document).on("ready", function () {
    //===== Sticky

    jQuery(window).on("scroll", function (event) {
      var scroll = jQuery(window).scrollTop();
      if (scroll < 150) {
        jQuery(".appie-sticky").removeClass("sticky");
      } else {
        jQuery(".appie-sticky").addClass("sticky");
      }
    });

    // wow js
   


    new WOW({
      boxClass: 'wow', // default
      animateClass: 'animated', // default
      offset: 0, // distance to the element when triggering the animation
      mobile: false, // turn off WOW.js on mobile to avoid issues
      live: true, // act on asynchronously loaded content
      callback: function (box) {
        // animation finished callback
      }
    }).init();


    //===== Magnific Popup

    jQuery(".appie-image-popup").magnificPopup({
      type: "image",
      gallery: {
        enabled: true,
      },
    });

    // Show or hide the sticky footer button
    jQuery(window).on("scroll", function (event) {
      if (jQuery(this).scrollTop() > 600) {
        jQuery(".back-to-top").fadeIn(200);
      } else {
        jQuery(".back-to-top").fadeOut(200);
      }
    });

    //Animate the scroll to yop
    jQuery(".back-to-top").on("click", function (event) {
      event.preventDefault();

      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;

      jQuery("*").animate(
        {
          scrollTop: 0,
        },
        1500
      );
    });

    // -----------------------------------------------Feature-Card---------------------------------------------------------//

    const API_URL =
      "https://colorful-connection-6a1901abf3.strapiapp.com/api/landing-page?populate[header][populate]=main_image&populate[cards][populate]=Phone_Image&populate[Download_App_Section][populate][Dowload_Android_Button][populate]=image&populate[Download_App_Section][populate][Download_IOS_Button][populate]=image&populate[Download_App_Section][populate]=Side_Image&populate[menu_links][populate]=logo&populate[menu_links][populate]=menu_links& populate[menu_links][populate]=logo&populate[social_media_icons_and_links][populate]=image";

    // Fetch the data and build the features dynamically
    let features = [];

    fetch(API_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json(); // Parse the JSON from the response
      })
      .then((apiResponse) => {
        console.log("dataFromAPi", apiResponse); // Log the data to inspect the structure

        // Dynamically map the cards from the API response to the features array
        features = apiResponse.data.cards.map((card, index) => {
          return {
            id: `v-pills-${index}`,
            title: card.Tittle || "No Title", // Handle missing data
            description: card.Description || "No Description",
            imageSrc: card?.Phone_Image?.url || "default-image.png", // Handle missing images
            icon: "fa-solid fa-indian-rupee-sign", // Adjust as per your data if icons come from API
            altText: "Best Prices Image", // Adjust or fetch from the API if available
          };
        });

        const isMobile = window.innerWidth <= 768;
        updateDOMWithFeatures(features); // Call the function to update the DOM

        renderFeatureCards(features);

        //------------------------------------------------------------------------------
        // HERO Section start
        const heroHeader = document.getElementById("hero-header");
        heroHeader.innerText = apiResponse?.data?.header?.Heading;

        const heroMainImage = document.getElementById("hero-main-image");

        heroMainImage.src = apiResponse?.data?.header?.main_image?.url;
        //-----------------------------------------------------------------------------

        //___________________________________________________________________________

        // project section  download section

        const projectHeader = document.getElementById(
          "download-section-header"
        );
        projectHeader.innerText =
          apiResponse?.data?.Download_App_Section?.Heading;

        const downloadSectionMainImage = document.getElementById(
          "download-section-main-image"
        );

        downloadSectionMainImage.src =
          apiResponse?.data?.Download_App_Section?.Side_Image?.url;

        //__________________________________________________________________________

        //navbar section footer section

        const footerMenu = document.getElementById("footer-menu");

        if (footerMenu) {
          apiResponse.data.menu_links.menu_links.forEach((link) => {
            const li = document.createElement("li");
            const a = document.createElement("a");

            a.href = link.link;
            a.textContent = link.name;

            li.appendChild(a);
            footerMenu.appendChild(li);
          });
        }

        const footerLogo = document.getElementById("footer-logo");

        footerLogo.src = apiResponse?.data?.menu_links?.logo?.url;

        const socialMediaIcons = document.getElementById("social-media-icons");

        if (socialMediaIcons) {
          apiResponse.data.social_media_icons_and_links.forEach((link) => {
            const img = document.createElement("img");
            // const a = document.createElement("a");

            img.src = link?.image?.url;
            img.href = link?.link;
            // a.href = link?.image?.url;
            // a.textContent = link.name;

            socialMediaIcons.appendChild(img);
          });
        }

        const downloadApp = document.getElementById("download-app");
        downloadApp.innerText =
          apiResponse?.data?.menu_links?.download_app_button;

        const navbarSideLogo = document.getElementById("navbar-side-logo");
        navbarSideLogo.src = apiResponse?.data?.menu_links?.logo?.url;

        //________________________________________________________________________

        function renderFeatureCards(cardData) {
          const cardsContainer = document.getElementById("separate-cards-div"); // Select the parent container

          cardData.forEach((card) => {
            // Create outer divs for each card
            const cardWrapper = document.createElement("div");
            cardWrapper.className =
              "row col-12 col-md-11 separate-cards single-features-wrap justify-content-center";

            const cardContainer = document.createElement("div");
            cardContainer.className = "col-12 col-md-11 card-with-arrows";

            const rowDiv = document.createElement("div");
            rowDiv.className = "row align-items-center";

            // Create image column
            const imgColDiv = document.createElement("div");
            imgColDiv.className = "col-12 col-md-6";

            const thumbDiv = document.createElement("div");
            thumbDiv.className =
              "appie-features-thumb text-center wow animated fadeInUp";
            thumbDiv.setAttribute("data-wow-duration", "2000ms");
            thumbDiv.setAttribute("data-wow-delay", "200ms");

            const imgBoxDiv = document.createElement("div");
            imgBoxDiv.className = "feature-image-box";

            const imgElement = document.createElement("img");
            imgElement.src = card.imageSrc;
            imgElement.alt = card.altText;
            imgElement.className = "responsive-img";

            imgBoxDiv.appendChild(imgElement);
            thumbDiv.appendChild(imgBoxDiv);
            imgColDiv.appendChild(thumbDiv);

            // Create content column
            const contentColDiv = document.createElement("div");
            contentColDiv.className = "col-12 col-md-6";

            const contentDiv = document.createElement("div");
            contentDiv.className =
              "appie-features-content wow animated fadeInRight";
            contentDiv.setAttribute("data-wow-duration", "2000ms");
            contentDiv.setAttribute("data-wow-delay", "200ms");

            const titleElement = document.createElement("h3");
            titleElement.className = "title";
            titleElement.textContent = card.title;

            const descriptionElement = document.createElement("p");
            descriptionElement.textContent = card.description;

            contentDiv.appendChild(titleElement);
            contentDiv.appendChild(descriptionElement);
            contentColDiv.appendChild(contentDiv);

            // Append image and content columns to row div
            rowDiv.appendChild(imgColDiv);
            rowDiv.appendChild(contentColDiv);

            // Add top-right arrow icon
            const arrowDiv = document.createElement("div");
            arrowDiv.className = "arrow-top-right";
            arrowDiv.innerHTML = '<i class="fas fa-arrow-right"></i>';

            // Add label
            const labelDiv = document.createElement("div");
            labelDiv.className = "label-bottom-right";
            labelDiv.textContent = card.label;

            // Assemble the card
            cardContainer.appendChild(rowDiv);
            cardContainer.appendChild(arrowDiv);
            cardContainer.appendChild(labelDiv);
            cardWrapper.appendChild(cardContainer);

            // Append the card to the container
            cardsContainer.appendChild(cardWrapper);
          });
        }

        // Call the renderCards function on page load
        document.addEventListener("DOMContentLoaded", renderCards);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });

    // Function to update the DOM with features
    function updateDOMWithFeatures(features) {
      const tabList = document.getElementById("v-pills-tab");
      const tabContent = document.getElementById("v-pills-tabContent");

      // Clear the existing content to prevent duplication
      tabList.innerHTML = "";
      tabContent.innerHTML = "";

      features.forEach((feature, index) => {
        // Tab buttons
        let tabBtn = document.createElement("a");
        tabBtn.className = `nav-link ${index === 0 ? "active" : ""}`;
        tabBtn.id = `${feature.id}-tab`;
        tabBtn.dataset.toggle = "pill";
        tabBtn.href = `#${feature.id}`;
        tabBtn.role = "tab";
        tabBtn.ariaControls = feature.id;
        tabBtn.ariaSelected = index === 0 ? "true" : "false";
        tabBtn.innerHTML = `
                    <i class="${feature.icon}"></i>
                    <strong class="title">${feature.title}</strong>
                    <p>${feature.description}</p>
                `;
        tabList.appendChild(tabBtn);

        // Tab content
        let tabPane = document.createElement("div");
        tabPane.className = `tab-pane fade ${index === 0 ? "show active" : ""}`;
        tabPane.id = feature.id;
        tabPane.role = "tabpanel";
        tabPane.ariaLabelledby = `${feature.id}-tab`;
        tabPane.innerHTML = `
                    <div class="row align-items-center">
                        <div class="col-lg-12">
                            <div class="appie-features-thumb text-center animated fadeInUp" data-wow-duration="2000ms" data-wow-delay="200ms">
                                <div class="feature-image-box">
                                    <img src="${feature.imageSrc}" alt="${feature.altText}" height="530px">
                                </div>
                            </div>
                        </div>
                    </div>
                `;
        tabContent.appendChild(tabPane);
      });
    }

    document.addEventListener("DOMContentLoaded", function () {
      requestAnimationFrame(function () {
        renderFeatureCards(cardData); // Ensuring DOM updates occur smoothly
        updateDOMWithFeatures(features);
      });
    });





    

    /*---canvas menu activation---*/
    $(".canvas_open").on("click", function () {
      $(".offcanvas_menu_wrapper,.off_canvars_overlay").addClass("active");
    });

    $(".canvas_close,.off_canvars_overlay").on("click", function () {
      $(".offcanvas_menu_wrapper,.off_canvars_overlay").removeClass("active");
    });

    /*---Off Canvas Menu---*/
    var $offcanvasNav = $(".offcanvas_main_menu"),
      $offcanvasNavSubMenu = $offcanvasNav.find(".sub-menu");
    $offcanvasNavSubMenu
      .parent()
      .prepend(
        '<span class="menu-expand"><i class="fa fa-angle-down"></i></span>'
      );

    $offcanvasNavSubMenu.slideUp();

    $offcanvasNav.on("click", "li a, li .menu-expand", function (e) {
      var $this = $(this);
      if (
        $this
          .parent()
          .attr("class")
          .match(/\b(menu-item-has-children|has-children|has-sub-menu)\b/) &&
        ($this.attr("href") === "#" || $this.hasClass("menu-expand"))
      ) {
        e.preventDefault();
        if ($this.siblings("ul:visible").length) {
          $this.siblings("ul").slideUp("slow");
        } else {
          $this.closest("li").siblings("li").find("ul:visible").slideUp("slow");
          $this.siblings("ul").slideDown("slow");
        }
      }
      if (
        $this.is("a") ||
        $this.is("span") ||
        $this.attr("clas").match(/\b(menu-expand)\b/)
      ) {
        $this.parent().toggleClass("menu-open");
      } else if (
        $this.is("li") &&
        $this.attr("class").match(/\b('menu-item-has-children')\b/)
      ) {
        $this.toggleClass("menu-open");
      }
    });
  });

  //----------------------------------------------------hero data--------------------------------------------------------------//

  // Hero content data
  const heroContent = {
    welcomeText: "Welcome To Appie",
    title: "Join Groups With Others to buy Discounted Products",
    downloadLinks: [
      { icon: "fab fa-apple", text: "Download for iOS", url: "#" },
      { icon: "fab fa-google-play", text: "Download for Android", url: "#" },
    ],
    imageSrc: "assets/image/Image.png",
    shapes: [
      "assets/images/shape/shape-2.png",
      "assets/images/shape/shape-3.png",
      "assets/images/shape/shape-4.png",
    ],
  };

  // Add shapes
  heroContent.shapes.forEach((shapeSrc, index) => {
    document.getElementById(
      `hero-shape-${index + 1}`
    ).innerHTML = `<img src="${shapeSrc}" alt="">`;
  });
})(jQuery);
