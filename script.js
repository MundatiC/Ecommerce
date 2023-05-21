// Function to fetch products from the API
async function fetchProducts() {
    try {
      const response = await fetch('https://fakestoreapi.com/products');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }
  
  // Function to populate the home page with product cards
  function populateHomePage(products) {
    const contentContainer = document.getElementById('content');
    const homeBackground = document.createElement('div');
    homeBackground.classList.add('home-background');
    contentContainer.appendChild(homeBackground);
  
    const productCardsContainer = document.createElement('div');
    productCardsContainer.classList.add('product-cards-container');
    contentContainer.appendChild(productCardsContainer);
  
    products.forEach(product => {
      const productCard = createProductCard(product);
      productCardsContainer.appendChild(productCard);
    });
  }
  
  // Function to create a product card element
  function createProductCard(product) {
    const productCard = document.createElement('div');
    productCard.classList.add('product-card');
  
    const image = document.createElement('img');
    image.src = product.image;
    productCard.appendChild(image);
  
    const title = document.createElement('h4');
    title.textContent = product.title;
    productCard.appendChild(title);
  
    const price = document.createElement('p');
    price.textContent = `$${product.price}`;
    productCard.appendChild(price);
  
    // Add event listener to navigate to product details page
    productCard.addEventListener('click', () => {
      navigateToProductDetails(product);
    });
  
    return productCard;
  }
  
  // Function to navigate to the product details page
  function navigateToProductDetails(product) {
    // Save the selected product to localStorage or session storage
    localStorage.setItem('selectedProduct', JSON.stringify(product));
  
    // Redirect to the product details page
    window.location.href = 'product-details.html';
  }
  
  // Function to populate the product details page
  function populateProductDetailsPage() {
    const contentContainer = document.getElementById('content');
    const product = JSON.parse(localStorage.getItem('selectedProduct'));
  
    const productDetails = document.createElement('div');
    productDetails.classList.add('product-details');
  
    const image = document.createElement('img');
    image.src = product.image;
    productDetails.appendChild(image);
  
    const details = document.createElement('div');
    details.innerHTML = `
      <h2>${product.title}</h2>
      <p class="price">Price: $${product.price}</p>
      <p class="desc">Description: ${product.description}</p>
      <button onclick="addToCart(),updateCartCount()">Add to Cart</button>
    `;
    productDetails.appendChild(details);
  
    contentContainer.appendChild(productDetails);
  }
  
  // Function to add the product to the cart
  function addToCart() {
    const product = JSON.parse(localStorage.getItem('selectedProduct'));
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  
    cartItems.push(product);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  
    alert('Product added to cart!');
  }
  
  // Function to populate the category page
  function populateCategoryPage(products) {
    const contentContainer = document.getElementById('content');
  
    const categoryFilter = document.createElement('div');
    categoryFilter.classList.add('category-filter');
  
    const select = document.createElement('select');
    select.addEventListener('change', () => {
      const selectedCategory = select.value;
      let filteredProducts = products;
      if (selectedCategory) {
        filteredProducts = products.filter(
          product => product.category === selectedCategory
        );
      }
      populateProductCards(filteredProducts);
    });
  
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'All Categories';
    select.appendChild(defaultOption);
  
    const categories = Array.from(
      new Set(products.map(product => product.category))
    );
  
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      select.appendChild(option);
    });
  
    categoryFilter.appendChild(select);
    contentContainer.appendChild(categoryFilter);
  
    const productCardsContainer = document.createElement('div');
    productCardsContainer.classList.add('product-cards-container');
    contentContainer.appendChild(productCardsContainer);
  
    populateProductCards(products);
  
    function populateProductCards(products) {
      productCardsContainer.innerHTML = '';
  
      products.forEach(product => {
        const productCard = createProductCard(product);
        productCardsContainer.appendChild(productCard);
      });
    }
  }
  
  
  // Function to populate the cart page
  function populateCartPage() {
    const contentContainer = document.getElementById('content');
    const cartItems = JSON.parse(localStorage.getItem('cartItems'));
  
    if (cartItems && cartItems.length > 0) {
      const cartList = document.createElement('ul');
      cartList.classList.add('cart-list');
  
      cartItems.forEach(item => {
        const cartItem = document.createElement('li');
        cartItem.classList.add('cart-item');
  
        const image = document.createElement('img');
        image.src = item.image;
        cartItem.appendChild(image);
  
        const details = document.createElement('div');
        details.innerHTML = `
          <h4>${item.title}</h4>
          <p>Price: $${item.price}</p>
          <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
        `;
        cartItem.appendChild(details);
  
        cartList.appendChild(cartItem);
        updateCartCount();
      });
  
      contentContainer.appendChild(cartList);
    } else {
      const message = document.createElement('p');
      message.textContent = 'Your cart is empty.';
      contentContainer.appendChild(message);
    }
  }
  
  // Function to remove an item from the cart
  function removeFromCart(itemId) {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  
    cartItems = cartItems.filter(item => item.id !== itemId);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  
    // Reload the cart page
    updateCartCount();
    window.location.reload();
  }

  // Function to update the cart count
function updateCartCount() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const cartCountElement = document.querySelector('.cart-count');
    const cartCount = cartItems.length;
  
    cartCountElement.textContent = cartCount;
  }
  
 
  
  // Handle page navigation
  function handleNavigation() {
    const currentUrl = window.location.href;
    const currentPage = currentUrl.split('/').pop();
  
    if (currentPage === 'index.html' || currentPage === '') {
      // Home page
      fetchProducts()
        .then(products => populateHomePage(products))
        .catch(error => console.error(error));
        updateCartCount();
    } else if (currentPage === 'product-details.html') {
      // Product details page
      populateProductDetailsPage();
      updateCartCount();
    } else if (currentPage === 'category.html') {
      // Category page
      fetchProducts()
        .then(products => populateCategoryPage(products))
        .catch(error => cons.error(error));
        updateCartCount();  
    } else if (currentPage === 'cart.html') {
      // Cart page
      populateCartPage();
    } 
    else {
      // Invalid page, redirect to home page
      window.location.href = 'index.html';
    }
  }
  
  // Load appropriate page based on navigation
  document.addEventListener('DOMContentLoaded', handleNavigation);
  