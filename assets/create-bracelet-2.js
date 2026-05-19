const isDesignMode = window.Shopify && window.Shopify.designMode;
/* Configuration for circular beads */
const sizeBeadCounts = {
    'xxs': 16,
    'xs': 17,
    's': 18,
    'm': 20,
    'l': 21,
    'xl': 22,
    'xxl': 23,
    'xxxl': 24,
    '4xl': 24
};

function refreshCircularLayout() {
    const parker = document.getElementById('parker');
    if (!parker) return;

    // Get selected size from the active card
    const activeSizeCard = document.querySelector('.size-card.active');
    if (!activeSizeCard) return;
    
    const sizeCode = activeSizeCard.querySelector('h5').textContent.trim().toLowerCase();
    const beadCount = sizeBeadCounts[sizeCode] || 20;

    const allDroppers = Array.from(parker.querySelectorAll('.dropper'));
    
    const radius = 41; // percent radius for the bead centers on the path
    const centerX = 50; 
    const centerY = 50;

    allDroppers.forEach((dropper, index) => {
        if (index < beadCount) {
            dropper.style.display = 'flex';
            
            // Calculate angle. 
            // 0 index at PI / 2 (bottom focal point) 
            // index / beadCount * 2 * PI goes clockwise
            const angle = ((index + 0.5) / beadCount) * 2 * Math.PI + (Math.PI / 2);
            
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            
            dropper.style.left = `${x}%`;
            dropper.style.top = `${y}%`;
            dropper.style.transform = 'translate(-50%, -50%)';
        } else {
            dropper.style.display = 'none';
        }
    });
}

const quantityInput = document.querySelector('.Bquantity');
  quantityInput.addEventListener('input', function() {
    if (this.value < 1 || this.value === '') {
      this.value = 1;
    }
  });

document.addEventListener('DOMContentLoaded', function() {
  const engravingOptions = document.querySelectorAll('input[name="properties[Engraving]"]');
  const engravingTextField = document.getElementById('Engraving_text_field');

  // Start hidden
  if (engravingTextField) {
    engravingTextField.style.display = 'none';
  }

  engravingOptions.forEach(option => {
    option.addEventListener('change', function() {
      if (document.querySelector('input[name="properties[Engraving]"]:checked')) {
        engravingTextField.style.display = 'block'; 
      } else {
        engravingTextField.style.display = 'none'; 
      }
    });
  });
});

// Sidebar Scripts
const buttons = document.querySelectorAll('.assets-btn');
const sidebars = document.querySelectorAll('.assets-sidebar');
const productSummery = document.querySelector(".product-summery");
let activeSidebar = null;

buttons.forEach(button => {
  button.addEventListener('click', (e) => {
    e.stopPropagation();
    const sidebarId = button.id + '-sidebar';
    const sidebar = document.getElementById(sidebarId);

    if (activeSidebar === sidebar) {
      sidebar.classList.remove('active');
      activeSidebar = null;
    } else {
      sidebars.forEach(sb => sb.classList.remove('active'));
      sidebar.classList.add('active');
      activeSidebar = sidebar;
    }
  });
});

document.querySelectorAll('.close-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const sidebar = btn.closest('.assets-sidebar');
    sidebar.classList.remove('active');
    activeSidebar = null;
  });
});




function resetProductForm() {
    // Reset form inputs to initial state
    const form = document.querySelector('form[action="/cart/add.js"]');
    if (form) form.reset();
    
    // Update product summary to N/A values
    const productSummary = document.querySelector('.product-summery');
    // if (productSummary) {
    //     const fields = ['size', 'string-color', 'lock-style', 'gender'];
    //     fields.forEach(field => {
    //         const bElement = productSummary.querySelector(`p.${field} b`);
    //         if (bElement) bElement.textContent = 'N/A';
    //     });
    // }
    
    // Reset stone-costing section
    const stoneCosting = document.querySelector('.stone-costing');
    if (stoneCosting) stoneCosting.innerHTML = '';
    
    // Reset total fare to base price
    const priceCount = document.querySelector('.price-count');
    if (priceCount) priceCount.textContent = 'NTD $100.00';
    
    // Reset engraving text input
    const engravingText = document.getElementById('engraving-text');
    if (engravingText) {
        engravingText.value = '';
        engravingText.style.border = '';
    }
    
    // Reset engraving options
    const engravingOptions = document.querySelectorAll('.engraving-options input[type="radio"]');
    if (engravingOptions.length > 0) {
        engravingOptions[0].checked = true;
    }
    
    // Reset gift wrapping to default
    const giftWrapping = document.querySelector('input[name="properties[Gift Wrapping]"][value="free"]');
    if (giftWrapping) giftWrapping.checked = true;
    
   
    // Clear selected stones object
    selectedStones = {};
    
    // Reset droppers
    const droppers = document.querySelectorAll('.product-wrapper .product-beautify #parker .dropper');
    droppers.forEach(dropper => {
        dropper.classList.remove('selected');
        const selectedStone = dropper.querySelector('.selected-stone');
        if (selectedStone) selectedStone.remove();
    });
    
    // Reset validation states
    const beadWarning = document.getElementById('bead-warning');
    if (beadWarning) beadWarning.style.display = 'none';
    
    const addToCartBtn = document.querySelector('.add-cart');
    if (addToCartBtn) {
        addToCartBtn.disabled = true;
        addToCartBtn.style.opacity = '0.5';
    }
    
    // Reset error messages
    const errorMessage = document.querySelector('.error-message');
    if (errorMessage) errorMessage.style.display = 'none';
}


// Get the active size card
function updateLockImageBasedOnSize() {
    const activeSizeCard = document.querySelector('.size-card.active');
    if (!activeSizeCard) return;

    const sizeText = activeSizeCard.querySelector('p')?.textContent || '';
    const sizeNumberMatch = sizeText.match(/\d+(\.\d+)?/); // Supports decimals
    const sizeNumber = sizeNumberMatch ? parseFloat(sizeNumberMatch[0]) : null;
    
    const activeLock = document.querySelector('.lockstyle-card.active');
    const lockEr = document.querySelector('#lockEr'); // Adjust selector if needed

    if (!activeLock || sizeNumber === null || !lockEr) return;

    let newSrc;
    if (sizeNumber < 21) {
        // Reverse logic: odd → evenSrc, even → oddSrc
        if (sizeNumber % 2 !== 0) {
            newSrc = activeLock.dataset.oddSrc; 
        } else {
            newSrc = activeLock.dataset.src; 
        }
    } else if (sizeNumber >= 21) {
        newSrc = activeLock.dataset.src;
    } else {
        // For size 20 → treat as even → oddSrc
        newSrc = activeLock.dataset.oddSrc;
    }

    lockEr.src = newSrc;
}

//  Bracelet Gender Selection
const genderCards = document.querySelectorAll('.gender-card');
genderCards.forEach(card => {
    card.addEventListener('click', () => {
        genderCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        const selectedGender = card.querySelector('h5').textContent.trim();
        const genderDisplay = productSummery.querySelector("p.gender b");
        if (genderDisplay) genderDisplay.textContent = selectedGender;
        const genderInput = document.querySelector('input[name="properties[Gender]"]');
        if (genderInput) genderInput.value = selectedGender;
    });
});


// Bracelet Size Selection
const sizeCards = document.querySelectorAll('.size-card');
const parker = document.getElementById('parker');
const lockEr = document.querySelector('img#lockEr');

function getCurrentSizeClass(element) {
    return Array.from(element.classList).find(cls => cls.startsWith('size-'));
}

sizeCards.forEach(card => {
    card.addEventListener('click', () => {
      
        resetProductForm();  // reset the form
        sizeCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');

        const selectedSizeClass = card.querySelector('h5').textContent.trim().toLowerCase();
        const selectedSizeName = card.querySelector('div').textContent.trim();
        
        const sizeDisplay = productSummery.querySelector("p.size b");
        if (sizeDisplay) sizeDisplay.textContent = selectedSizeName;
        
        const sizeInput = document.querySelector('input[name="properties[Bracelet Size]"]');
        if (sizeInput) sizeInput.value = selectedSizeName;

        const currentSizeClass = getCurrentSizeClass(parker);
        if (currentSizeClass) {
            parker.classList.remove(currentSizeClass);
        }
        parker.classList.add(`size-${selectedSizeClass}`);

        // Update lock image based on size
             //   const activeLock = document.querySelector('.lockstyle-card.active');
            //   if (activeLock) {
           // const useOddSrc = ['xxs', 's', 'l'].includes(selectedSizeClass);
          //  const newSrc = useOddSrc ? activeLock.dataset.oddSrc : activeLock.dataset.src;
         //   lockEr.src = newSrc;
       // }

    // Run on page load
    updateLockImageBasedOnSize();
    refreshCircularLayout();
     const beads = document.querySelector('#beads');
    if (beads) {
      // Simulate a click
      beads.click();
    }
    
    });
});

   setTimeout(() => {
        const firstSizeCard = document.querySelector('.size-card.active');
        if (firstSizeCard) {
            firstSizeCard.click();
        }
    }, 100);



// StringColor Selection
const StringColorCards = document.querySelectorAll('.stringcolor-card');
StringColorCards.forEach(card => {
    card.addEventListener('click', () => {
        StringColorCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        document.querySelector("img#emBrace").src = card.dataset.src;
        let selectedStringColor = card.querySelector('h6').textContent.trim();
        const colorDisplay = productSummery.querySelector("p.string-color b");
        if (colorDisplay) colorDisplay.textContent = selectedStringColor;
        
        const colorInput = document.querySelector('input[name="properties[String Color]"]');
        if (colorInput) colorInput.value = selectedStringColor;

    });
});

// // Lockstyle Selection
// const lockstyleCards = document.querySelectorAll('.lockstyle-card');
// lockstyleCards.forEach(card => {
//     card.addEventListener('click', () => {
//         lockstyleCards.forEach(c => c.classList.remove('active'));
//         card.classList.add('active');
//         document.querySelector("img#lockEr").src = card.dataset.src;
//         let lockStyle = card.querySelector('h6').textContent.trim();
//         productSummery.querySelector("p.lock-style b").textContent = lockStyle;
//         document.querySelector('input[name="properties[Lock Style]"]').value = lockStyle;
//     });
// });

// Lockstyle Selection
const lockstyleCards = document.querySelectorAll('.lockstyle-card');
lockstyleCards.forEach(card => {
    card.addEventListener('click', () => {
        lockstyleCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');

        const parker = document.querySelector('#parker');
        const lockEr = document.querySelector('img#lockEr');
        const useOddSrc = parker.classList.contains('size-xxs') || parker.classList.contains('size-s') || parker.classList.contains('size-l');

        lockEr.src = useOddSrc ? card.dataset.oddSrc : card.dataset.src;
       
        const lockStyle = card.querySelector('h6').textContent.trim();
        const lockDisplay = productSummery.querySelector("p.lock-style b");
        if (lockDisplay) lockDisplay.textContent = lockStyle;
        
        const lockInput = document.querySelector('input[name="properties[Lock Style]"]');
        if (lockInput) lockInput.value = lockStyle;
        updateLockImageBasedOnSize();
    });
});



// add beads

// Object to track quantities of beads

//let selectedStones = {};

// const stonCards = document.querySelectorAll(".stone-card");
// stonCards.forEach(card => {
//   card.addEventListener('click', () => {
//     let selectedPositions = document.querySelectorAll('.product-wrapper .product-beautify #parker .dropper.selected');

//     selectedPositions.forEach(pos => {
//       // Remove any existing selected stone in the dropper
//       const existingStone = pos.querySelector('.selected-stone');
//       if (existingStone) {
//         existingStone.remove();
//       }

//       // Extract the required details from the card
//       let imgSrc = card.querySelector('img').src;  // Image source
//       let stoneTitle = card.querySelector('h6').textContent.trim();  // Title
//       // let stonePrice = card.querySelector('p[data-bead-price]').textContent.trim().replace('NTD ', '');  // Price (remove NTD symbol)

//     const priceElement = card.querySelector('[data-bead-price]');
//     const stonePrice = parseFloat(priceElement.dataset.beadPrice);
//     const currencySymbol = priceElement.dataset.currency; // "NTD"
    
//     // If you need to display it formatted:
//     priceElement.textContent = `${currencySymbol} $${stonePrice.toFixed(2)}`;

      
//       // let stoneId = card.querySelector('input[data-bride-id]');  // ID (hidden input)

//       let stoneIdInput = card.querySelector('input[data-bride-id]');
//       let stoneId = stoneIdInput.dataset.brideId;
      
//       // If the stone is already selected, increment its quantity
//       if (selectedStones[stoneTitle]) {
//         selectedStones[stoneTitle].quantity += 1;
//       } else {
//         selectedStones[stoneTitle] = {
//           price: parseFloat(stonePrice),
//           quantity: 1,
//           image: imgSrc,
//           stoneId: stoneId
//         };
//       }

//       // Log these details for debugging
//       // console.log("Stone Title:", stoneTitle);
//       // console.log("Stone Price:", stonePrice);
//       // console.log("Stone Quantity:", selectedStones[stoneTitle].quantity);

//       // Rebuild the stone-costing section with updated quantities
//       updateStoneCosting();

//       // Append the selected stone image to the dropper area
//       let div = document.createElement('div');
//       div.classList.add('selected-stone');
      
//       let img = document.createElement('img');
//       img.src = imgSrc;
//       div.appendChild(img);
            
//       pos.appendChild(div);

//       // Remove the 'selected' class from the dropper
//       pos.classList.remove('selected');
//     });
//   });
// });

// // Function to update the stone-costing display and total price
// function updateStoneCosting() {
//   const stoneCostingContainer = document.querySelector('.stone-costing');
//   stoneCostingContainer.innerHTML = '';  // Clear previous stones

//   let totalPrice = 100;  // Start with the base product price

//   // Loop through the selected stones and add them to the display
//   for (let stoneTitle in selectedStones) {
//     const stone = selectedStones[stoneTitle];
    
//     // Create the stone group (bundle) element
//     let stoneGroup = document.createElement('div');
//     stoneGroup.classList.add('stone-group');

//     // Stone title and price
//     let titleDiv = document.createElement('div');
//     titleDiv.classList.add('stone-title');
//     titleDiv.textContent = `${stoneTitle} x ${stone.quantity}`;  // Include quantity

//     let priceDiv = document.createElement('div');
//     priceDiv.classList.add('stone-price');
//     let totalStonePrice = (stone.price * stone.quantity).toFixed(2);
//     priceDiv.textContent = `NTD $${totalStonePrice}`;  // Total price for this stone
//     priceDiv.setAttribute("product-id", stone.stoneId);    
//     priceDiv.setAttribute("product-quantity", stone.quantity);
//     priceDiv.setAttribute("product-title", stoneTitle);
//     priceDiv.setAttribute("beads", "true");
    
//     // Add image of the stone
//     let img = document.createElement('img');
//     img.src = stone.image;
//     img.classList.add('stone-image');

//     // Append the elements to the stone-group
//     stoneGroup.appendChild(titleDiv);
//     stoneGroup.appendChild(priceDiv);

//     // Add the stone group (bundle) to the stone-costing container
//     stoneCostingContainer.appendChild(stoneGroup);

//     // Update the total price
//     totalPrice += stone.price * stone.quantity;
//   }

//   // Update the total price in the total fare
//   const priceCountElem = document.querySelector('.price-count');
//   priceCountElem.textContent = `NTD $${totalPrice.toFixed(2)}`;
  
// }


// ///////////////////////////////////////////////////

// ===============================
// TRACK SELECTED BEADS BY VARIANT ID
// ===============================
let selectedStones = {};

// ===============================
// HELPERS
// ===============================
function updateBeadStockUI(card, remaining) {
  const stockLabel = card.querySelector(".bead-stock");
  if (!stockLabel) return;

  if (remaining > 0) {
    stockLabel.textContent = `In stock: ${remaining}`;
    card.classList.remove("is-disabled");
    card.removeAttribute("aria-disabled");
  } else {
    stockLabel.textContent = "Insufficient stock";
    card.classList.add("is-disabled");
    card.setAttribute("aria-disabled", "true");
  }
}

// ===============================
// UPDATE COSTING & TOTAL
// ===============================
function updateStoneCosting() {
  const stoneCostingContainer = document.querySelector(".stone-costing");
  stoneCostingContainer.innerHTML = "";

  let totalPrice = 100; // Base product price

  for (let variantId in selectedStones) {
    const stone = selectedStones[variantId];

    const stoneGroup = document.createElement("div");
    stoneGroup.classList.add("stone-group");

    const titleDiv = document.createElement("div");
    titleDiv.classList.add("stone-title");
    titleDiv.textContent = `${stone.title} x ${stone.quantity}`;

    const priceDiv = document.createElement("div");
    priceDiv.classList.add("stone-price");

    const totalStonePrice = (stone.price * stone.quantity).toFixed(2);
    priceDiv.textContent = `NTD $${totalStonePrice}`;

    priceDiv.setAttribute("product-id", stone.stoneId);
    priceDiv.setAttribute("product-quantity", stone.quantity);
    priceDiv.setAttribute("product-title", stone.title);
    priceDiv.setAttribute("beads", "true");

    stoneGroup.appendChild(titleDiv);
    stoneGroup.appendChild(priceDiv);
    stoneCostingContainer.appendChild(stoneGroup);

    totalPrice += stone.price * stone.quantity;
  }

  document.querySelector(".price-count").textContent =
    `NTD $${totalPrice.toFixed(2)}`;
}

// ===============================
// STONE CARD CLICK HANDLING
// ===============================
const stoneCards = document.querySelectorAll(".stone-card");

stoneCards.forEach(card => {
  card.addEventListener("click", () => {

    // Guard 1: Disabled stone
    if (card.classList.contains("is-disabled")) {
      alert("Insufficient stock for this bead.");
      return;
    }

    const variantId = card.dataset.variantId;
    const inventory = parseInt(card.dataset.inventory, 10);

    const currentQty = selectedStones[variantId]?.quantity || 0;
    const remaining = inventory - currentQty;

    // Guard 2: Inventory exhausted
    if (remaining <= 0) {
      updateBeadStockUI(card, 0);
      alert("Insufficient stock for this bead.");
      return;
    }

    const selectedPositions = document.querySelectorAll(
      ".product-wrapper .product-beautify #parker .dropper.selected"
    );

    selectedPositions.forEach(pos => {

      // ===============================
      // REMOVE EXISTING BEAD (RESTORE INVENTORY IMMEDIATELY)
      // ===============================
      const existingStone = pos.querySelector(".selected-stone");

      if (existingStone) {
        const oldVariantId = existingStone.dataset.variantId;

        if (selectedStones[oldVariantId]) {
          selectedStones[oldVariantId].quantity -= 1;

          if (selectedStones[oldVariantId].quantity <= 0) {
            delete selectedStones[oldVariantId];
          }

          const oldCard = document.querySelector(
            `.stone-card[data-variant-id="${oldVariantId}"]`
          );

          if (oldCard) {
            const oldInventory = parseInt(oldCard.dataset.inventory, 10);
            const usedQty = selectedStones[oldVariantId]?.quantity || 0;

            // ✅ Update stock immediately
            updateBeadStockUI(oldCard, oldInventory - usedQty);
          }

          updateStoneCosting();
        }

        existingStone.remove();
      }

      // ===============================
      // ADD NEW BEAD
      // ===============================
      const imgSrc = card.querySelector("img").src;
      const stoneTitle = card.querySelector("h6").textContent.trim();

      const priceElement = card.querySelector("[data-bead-price]");
      const stonePrice = parseFloat(priceElement.dataset.beadPrice);

      const stoneId = card.querySelector("input[data-bride-id]").dataset.brideId;

      if (selectedStones[variantId]) {
        selectedStones[variantId].quantity += 1;
      } else {
        selectedStones[variantId] = {
          title: stoneTitle,
          price: stonePrice,
          quantity: 1,
          image: imgSrc,
          stoneId: stoneId,
          inventory: inventory
        };
      }

      const updatedRemaining = inventory - selectedStones[variantId].quantity;

      // ✅ Update stock immediately after adding
      updateBeadStockUI(card, updatedRemaining);

      updateStoneCosting();

      // ===============================
      // ADD BEAD TO DROPPER
      // ===============================
      const div = document.createElement("div");
      div.classList.add("selected-stone");
      div.dataset.variantId = variantId;

      const img = document.createElement("img");
      img.src = imgSrc;

      div.appendChild(img);
      pos.appendChild(div);
      pos.classList.remove("selected");
    });
  });
});

// /////////////////////////////////////////////////




// droppers
const droppers = document.querySelectorAll('.product-wrapper .product-beautify #parker .dropper');
droppers.forEach(dropper => {
    dropper.addEventListener('click', () => {
        // Toggle the selected state of the dropper
        dropper.classList.toggle('selected');
    });
});


document.addEventListener("DOMContentLoaded", () => {
  // If we're in the theme editor, we might want to skip auto-clicks if they cause issues
  // or wrap them in a small timeout to ensure editor stability.
  
  setTimeout(() => {
    const genderCards = document.querySelectorAll('.gender-card');
    if (genderCards.length > 0 && !isDesignMode) genderCards[0].click();
    
    const sizeCards = document.querySelectorAll('.size-card');
    if (sizeCards.length > 1 && !isDesignMode) {
        sizeCards[1].click();
    }
    
    const stringCards = document.querySelectorAll('.stringcolor-card');
    if (stringCards.length > 0 && !isDesignMode) stringCards[0].click();
    
    const lockCards = document.querySelectorAll('.lockstyle-card');
    if (lockCards.length > 0 && !isDesignMode) lockCards[0].click();
  }, isDesignMode ? 1500 : 100);
});

 function showLoader() {
    document.getElementById('loadingOverlay').style.display = 'flex';
  }

  function hideLoader() {
    document.getElementById('loadingOverlay').style.display = 'none';
  }

document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('form[action="/cart/add.js"]');
  if (!form) return;

  // Preload html2canvas to prevent race conditions
  const html2canvasPromise = loadHtml2Canvas();

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    showLoader();
    document.querySelector("div#instruction").style.display = "none";
    // UI Loading State
    const submitBtn = form.querySelector('[type="submit"]');
    const originalBtnText = submitBtn.value;
    submitBtn.value = 'Processing...';
    submitBtn.disabled = true;

    try {
      // 1. CAPTURE CUSTOM IMAGE
      const imageData = await captureCustomDesign();
      
      // 2. PREPARE CART ITEMS
      const { mainProductData, beadItems } = prepareCartData(form, imageData);
      
      // 3. SUBMIT TO CART
      await processCartSubmission(mainProductData, beadItems);
      
      // 4. REDIRECT TO CART
       hideLoader();
       window.location.href = '/cart';
      
    } catch (error) {
      console.error('Cart Submission Error:', error);
      alert('Could not complete your request. Please try again.');
    } finally {
      submitBtn.value = originalBtnText;
      submitBtn.disabled = false;
    }
  });

  // ========== CORE FUNCTIONS ========== //

  async function captureCustomDesign() {
    try {
      await html2canvasPromise;
      const element = document.getElementById('parker');
      if (!element) return null;

      // First attempt with moderate quality
      let canvas = await html2canvas(element, {
        scale: 0.8,
        quality: 0.6,
        logging: false,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      let imageUrl = canvas.toDataURL('image/jpeg', 0.6);
      
      // Fallback if too large (Shopify limit ~64KB)
      if (imageUrl.length > 60000) {
        console.warn('Image too large, retrying with lower quality');
        canvas = await html2canvas(element, {
          scale: 0.6,
          quality: 0.4,
          logging: false,
          useCORS: true
        });
        imageUrl = canvas.toDataURL('image/jpeg', 0.4);
      }

      return imageUrl.length < 60000 ? imageUrl : null;
      
    } catch (error) {
      console.error('Design Capture Failed:', error);
      return null;
    }
  }

  function prepareCartData(form, imageData) {
    const formData = new FormData(form);

    // Generate bundle ID using timestamp
    const bundleId = 'bundle_' + Date.now();

    
    // Main product data
    const mainProductData = {
      id: formData.get('id'),
      quantity: formData.get('quantity') || 1,
      properties: {
        'Bundle Id': bundleId,
        'Bracelet Size': formData.get('properties[Bracelet Size]'),
        'String Color': formData.get('properties[String Color]'),
        'Lock Style': formData.get('properties[Lock Style]'),
        'Gender': formData.get('properties[Gender]'),
        'Base Price': formData.get('properties[Base Price]'),
        'Gift Wrapping': formData.get('properties[Gift Wrapping]'),
        'Engraving': formData.get('properties[Engraving]'),
        'Text': formData.get('properties[Text]'),
        'Bead Items': Array.from(document.querySelectorAll('.stone-price[beads="true"]'))
        .map(el => {
          const title = el.getAttribute('product-title') || el.textContent.trim();
          const qty = el.getAttribute('product-quantity') || 1;
          return title ? `${title} x ${qty}` : null;
        })
        .filter(item => item)
        .join(', ')   
      }
    };

    // Add custom image if available
    if (imageData) {
      mainProductData.properties['Final Image'] = imageData;
    }

// Bead items data
const beadItems = [];
document.querySelectorAll('.stone-price[beads="true"]').forEach(el => {
  const id = el.getAttribute('product-id');
  const quantity = el.getAttribute('product-quantity') || 1;

  if (id) {
    beadItems.push({ 
      id, 
      quantity
    });    
  }
});
    return { mainProductData, beadItems};
  }

  async function processCartSubmission(mainProduct, beadItems) {
    // Add main product first
    const mainResponse = await fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mainProduct)
    });
    
    const mainResult = await mainResponse.json();
    if (mainResult.error) throw new Error(mainResult.description);
    
    for (const [index, item] of beadItems.entries()) {
          
      try {
        const beadResponse = await fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item)
        });
          
        const beadResult = await beadResponse.json();
        if (beadResult.error) console.warn(`Bead ${index + 1} error:`, beadResult.description);
        
        // Add delay between requests (300ms)
        if (index < beadItems.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      } catch (error) {
        console.error(`Bead ${index + 1} failed:`, error);
      }
    }
  }

  function loadHtml2Canvas() {
    if (typeof html2canvas === 'function') {
      return Promise.resolve();
    }
    
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://html2canvas.hertzen.com/dist/html2canvas.min.js';
      script.onload = resolve;
      script.onerror = () => reject(new Error('html2canvas failed to load'));
      document.head.appendChild(script);
    });
  }
});


// document.getElementById('engraving-text').addEventListener('input', function(e) {
//   const maxLength = 3;
//   let errorElement = this.nextElementSibling;

//   // Remove existing error message if it's ours
//   if (errorElement && errorElement.classList.contains('error-message')) {
//     errorElement.remove();
//   }

//   // Trim input to max length
//   if (this.value.length > maxLength) {
//     this.value = this.value.substring(0, maxLength);
    
//     // Add red border
//     this.style.border = '1px solid red';

//     // Add invisible error element if needed (optional, can be skipped entirely)
//     if (!errorElement || !errorElement.classList.contains('error-message')) {
//       errorElement = document.createElement('small');
//       errorElement.className = 'error-message';
//       errorElement.style.display = 'none'; // hidden
//       this.insertAdjacentElement('afterend', errorElement);
//     }
//   } else {
//     // Reset border if input is valid
//     this.style.border = '';
//   }
// });

document.addEventListener('DOMContentLoaded', function () {
  const engravingInput = document.getElementById('engraving-text');
  const errorMessage = document.querySelector('.error-message');

  engravingInput.addEventListener('input', () => {
    let text = engravingInput.value;

    const chineseCharCount = (text.match(/[\u4e00-\u9fff]/g) || []).length;
    const latinCharCount = (text.match(/[a-zA-Z]/g) || []).length;
    const spaceCount = (text.match(/ /g) || []).length;

    // Validation logic
    let isChinese = chineseCharCount > 0;
    let isLatin = latinCharCount > 0;

    if (isChinese && !isLatin) {
      if (chineseCharCount > 13 || spaceCount > 12) {
        engravingInput.value = text.substring(0, engravingInput.value.length - 1);
        errorMessage.textContent = '最多可輸入 13 個中文字和 12 個空格。';
        errorMessage.style.display = 'block';
        return;
      }
    } else {
      if (latinCharCount > 15 || spaceCount > 4) {
        engravingInput.value = text.substring(0, engravingInput.value.length - 1);
        errorMessage.textContent = '最多可輸入 15 個英文字母和 4 個空格。';
        errorMessage.style.display = 'block';
        return;
      }
    }

    if (text.trim().length === 0) {
      errorMessage.textContent = '請輸入刻印文字。';
      errorMessage.style.display = 'block';
    } else {
      errorMessage.style.display = 'none';
    }
  });
});



// accordion

  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const accordionItem = header.parentElement;

      // Optional: Close other open items
      document.querySelectorAll('.accordion-item').forEach(item => {
        if (item !== accordionItem) {
          item.classList.remove('active');
        }
      });

      // Toggle active class on the clicked item
      accordionItem.classList.toggle('active');
    });
  });


  // add to cart validation

document.addEventListener('DOMContentLoaded', function () {
  const parker = document.getElementById('parker');
  const addToCartBtn = document.querySelector('input.add-cart');

  function isVisible(el) {
    return !!(el.offsetParent !== null && getComputedStyle(el).display !== 'none');
  }

  function validateDroppers() {
    const droppers = parker.querySelectorAll('.dropper');
    let allValid = true;

    droppers.forEach(drop => {
      if (isVisible(drop) && !drop.querySelector('.selected-stone')) {
        allValid = false;
      }
    });

    const warning = document.getElementById('bead-warning');
    warning.style.display = allValid ? 'none' : 'block';

    addToCartBtn.disabled = !allValid;
    addToCartBtn.style.opacity = allValid ? '1' : '0.5';
  }

  // Observe changes to #parker class or .dropper elements
  const observer = new MutationObserver(() => {
    validateDroppers();
  });

  observer.observe(parker, {
    attributes: true,
    subtree: true,
    childList: true,
    attributeFilter: ['class', 'style']
  });

  // Also trigger validation on user interactions (e.g., stone selection)
  parker.addEventListener('click', (e) => {
    if (e.target.closest('.dropper')) {
      setTimeout(validateDroppers, 50);
    }
  });

  // Initial check
  validateDroppers();
});

document.addEventListener('DOMContentLoaded', function () {
  const closeBtn = document.getElementById('close-instruction');
  const instructionBox = document.getElementById('instruction');

  closeBtn.addEventListener('click', function () {
    instructionBox.style.display = 'none';
  });
});


setTimeout(()=>{
// Open the first sidebar on page load
if (buttons && buttons.length > 0 && !isDesignMode) {
    const firstButton = buttons[0];
    const firstSidebar = document.getElementById(firstButton.id + '-sidebar');
    if (firstSidebar) {
        firstSidebar.classList.add('active');
        activeSidebar = firstSidebar;
    }
}
},1000);