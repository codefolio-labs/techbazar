let cart = [];
let isLoggedIn = false;
let pendingCheckout = false;

let products = [
  {id:1, name:"iPhone 15 Pro Max", price:450000, cat:"Smartphone", img:"https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400"},
  {id:2, name:"Samsung S24 Ultra", price:380000, cat:"Smartphone", img:"https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?w=400"},
  {id:3, name:"HP Laptop 15", price:185000, cat:"Laptop", img:"https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400"},
  {id:4, name:"MacBook Air M2", price:320000, cat:"Laptop", img:"https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400"},
  {id:5, name:"AirPods Pro 2", price:75000, cat:"Headphones", img:"https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400"},
  {id:6, name:"Sony WH-1000XM5", price:85000, cat:"Headphones", img:"https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400"},
  {id:7, name:"Apple Watch Series 9", price:125000, cat:"Watches", img:"https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400"},
  {id:8, name:"Galaxy Watch 6", price:95000, cat:"Watches", img:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400"}
];

function showToast(msg){
  let t = document.getElementById('toast');
  t.innerText = msg;
  t.style.display = 'block';
  setTimeout(()=> t.style.display='none', 2500);
}

function showPage(id){
  document.querySelectorAll('.page').forEach(p=> p.style.display='none');
  document.getElementById(id).style.display='block';
  window.scrollTo(0,0);
}

function loadProducts(){
  let html = products.map(p=> `
    <div class="product">
      <img src="${p.img}" onerror="this.src='https://via.placeholder.com/260x190?text=No+Image'" onclick="openDetail(${p.id})">
      <div class="info">
        <h4>${p.name}</h4>
        <p>Rs. ${p.price}</p>
        <button class="view-btn" onclick="openDetail(${p.id})">View</button>
        <button class="add-btn" onclick="addToCart(${p.id})">Add to Cart</button>
      </div>
    </div>`).join('');
  document.getElementById('featured').innerHTML = html;
  document.getElementById('shopProducts').innerHTML = html;
}

function openDetail(id){
  let p = products.find(x=> x.id===id);
  if(!p){ showToast("Product nahi mila"); return; }
  let detailDiv = document.getElementById('detailContent');
  detailDiv.innerHTML = `
    <div class="detail-wrap">
      <img src="${p.img}" onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'">
      <div>
        <h2>${p.name}</h2>
        <h3 style="margin-top:10px;">Rs. ${p.price}</h3>
        <p style="margin-top:15px;">100% Original with Warranty. Cash on Delivery available.</p>
        <div style="margin-top:20px; display:flex; gap:10px;">
          <button class="btn" onclick="addToCart(${p.id})">Add to Cart</button>
          <button class="btn" style="background:#111" onclick="showPage('shop')">Back to Shop</button>
        </div>
      </div>
    </div>`;
  showPage('product-detail');
}

function sendContact(){ 
  let n=document.getElementById('contactName')?.value || document.querySelector('#contact input[type="text"]')?.value;
  let e=document.getElementById('contactEmail')?.value || document.querySelector('#contact input[type="email"]')?.value;
  let m=document.getElementById('contactMsg')?.value || document.querySelector('#contact textarea')?.value;
  if(n==""||e==""||m==""){
    showToast("Please fill all fields");
    return;
  }
  if(document.getElementById('contactName')) document.getElementById('contactName').value="";
  if(document.getElementById('contactEmail')) document.getElementById('contactEmail').value="";
  if(document.getElementById('contactMsg')) document.getElementById('contactMsg').value="";
  showSuccess("Message Sent!", "Your message has been sent successfully. We will contact you soon.");
}

function addToCart(id){
  let p = products.find(x=> x.id===id);
  cart.push(p);
  document.getElementById('cartCount').innerText = cart.length;
  updateCart();
  showToast(p.name + " Added");
}

function updateCart(){
  let items = document.getElementById('cartItems');
  let totalEl = document.getElementById('total');
  if(cart.length===0){ items.innerHTML="<p>Cart is empty</p>"; totalEl.innerText="0"; return; }
  let total=0;
  items.innerHTML = cart.map(c=>{ total+=c.price; return `<p>${c.name} - Rs. ${c.price}</p>`}).join('');
  totalEl.innerText = total;
}

function doLogin(){
  if(document.getElementById('loginEmail').value===""){ showToast("Email likhen"); return; }
  isLoggedIn=true;
  document.getElementById('loginLink').innerText="Logout";
  showSuccess("Login Successful!", "Welcome! You have logged in successfully.");
}

function goToCheckout(){
  if(cart.length===0){ showToast("Cart Empty hai"); return; }
  if(!isLoggedIn){ 
    pendingCheckout = true;
    showPage('login'); 
    showToast("Pehle Login karen"); 
    return; 
  }
  showPage('checkoutForm');
}

function placeOrder(){
  cart=[];
  document.getElementById('cartCount').innerText="0";
  document.getElementById('total').innerText="0";
  if(document.getElementById('cartItems')) document.getElementById('cartItems').innerHTML="<p>Cart is empty</p>";
  showSuccess("Order Placed!", "Shukria! Aapka order successfully place ho gaya hai.");
}

function filterCat(cat,btn){
  document.querySelectorAll('.categories button').forEach(b=> b.classList.remove('active'));
  btn.classList.add('active');
  if(cat==='all'){ loadProducts(); return; }
  let filtered = products.filter(p=> p.cat===cat);
  let html = filtered.map(p=> `
    <div class="product"><img src="${p.img}" onerror="this.src='https://via.placeholder.com/260x190?text=No+Image'" onclick="openDetail(${p.id})"><div class="info"><h4>${p.name}</h4><p>Rs. ${p.price}</p><button class="view-btn" onclick="openDetail(${p.id})">View</button><button class="add-btn" onclick="addToCart(${p.id})">Add to Cart</button></div></div>`).join('');
  document.getElementById('shopProducts').innerHTML = html || "<p>No products found</p>";
}

function searchProducts(){
  let q = document.getElementById('searchInput').value.toLowerCase();
  let filtered = products.filter(p=> p.name.toLowerCase().includes(q));
  let html = filtered.map(p=> `
    <div class="product"><img src="${p.img}" onerror="this.src='https://via.placeholder.com/260x190?text=No+Image'" onclick="openDetail(${p.id})"><div class="info"><h4>${p.name}</h4><p>Rs. ${p.price}</p><button class="view-btn" onclick="openDetail(${p.id})">View</button><button class="add-btn" onclick="addToCart(${p.id})">Add to Cart</button></div></div>`).join('');
  document.getElementById('shopProducts').innerHTML = html;
}

function showSuccess(title, msg){
  document.getElementById('successTitle').innerText = title;
  document.getElementById('successMsg').innerText = msg;
  document.getElementById('successModal').style.display = 'flex';
}

function closeSuccess(){
  document.getElementById('successModal').style.display = 'none';
  if(pendingCheckout){
    pendingCheckout = false;
    if(cart.length>0){
      showPage('cart');
      updateCart();
    } else {
      showPage('home');
    }
  } else {
    showPage('home');
  }
}

loadProducts();