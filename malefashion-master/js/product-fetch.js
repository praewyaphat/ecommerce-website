// colin
document.addEventListener("DOMContentLoaded", function () {
  const productList = document.getElementById("product-list");
  const searchInput = document.getElementById("search-input");

  function renderProducts(products) {
    console.clear();
    console.log("✅ แสดงสินค้าใหม่", products);
    productList.innerHTML = "";

    if (!Array.isArray(products)) {
      productList.innerHTML = "<p class='text-danger'>เกิดข้อผิดพลาดในการโหลดสินค้า</p>";
      return;
    }

    if (products.length === 0) {
      productList.innerHTML = "<p class='text-center w-100'>ไม่พบสินค้า</p>";
      return;
    }

    products.forEach(p => {
      productList.insertAdjacentHTML("beforeend", `
        <div class="col-lg-4 col-md-6 col-sm-6">
          <div class="product__item">
            <div class="product__item__pic set-bg" data-setbg="${p.image}">
              <ul class="product__hover">
                <li><a href="#"><img src="img/icon/heart.png" alt=""></a></li>
                <li><a href="#"><img src="img/icon/compare.png" alt=""> <span>Compare</span></a></li>
                <li><a href="#"><img src="img/icon/search.png" alt=""></a></li>
              </ul>
            </div>
            <div class="product__item__text">
              <h6>${p.name}</h6>
              <h5>฿${p.price}</h5>
            </div>
          </div>
        </div>
      `);
    });

    document.querySelectorAll(".set-bg").forEach(el => {
      el.style.backgroundImage = `url(${el.getAttribute("data-setbg")})`;
    });
  }

  // โหลดสินค้าทั้งหมด
  fetch("http://localhost:3000/api/products")
    .then(res => {
      if (!res.ok) throw new Error("โหลดไม่ได้: " + res.status);
      return res.json();
    })
    .then(data => {
      renderProducts(data);
    })
    .catch(err => {
      console.error("โหลดสินค้าไม่สำเร็จ:", err);
      renderProducts([]); // ป้องกัน render ซ้ำ
    });

  // ค้นหาจากช่องค้นหา popup
  if (searchInput) {
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const keyword = searchInput.value.trim();
        if (!keyword) return;

        fetch(`http://localhost:3000/api/search?keyword=${encodeURIComponent(keyword)}`)
          .then(res => res.json())
          .then(products => {
            renderProducts(products);
            document.querySelector(".search-model")?.classList.remove("active");
            document.body.classList.remove("search-show");
            document.querySelector(".search-model").style.display = "none";
          })
          .catch(err => {
            console.error("ค้นหาไม่สำเร็จ:", err);
            renderProducts([]);
          });
      }
    });
  }
});



//BB
// public/js/product-fetch.js
const products = [
  { id: 1,  name: 'Blown Jacket',      price: 67.24, category: 'clothing',    image: 'img/product/product-2.jpg' },
  { id: 2,  name: 'Sneaker Blue',       price: 43.48, category: 'shoes',       image: 'img/product/product-3.jpg' },
  { id: 3,  name: 'Shirt hood',         price: 60.90, category: 'clothing',    image: 'img/product/product-4.jpg' },
  { id: 4,  name: 'Jeans',              price: 98.49, category: 'fashio',      image: 'img/product/product-6.jpg' },
  { id: 5,  name: 'Backpack Pocket',    price: 49.66, category: 'bags',        image: 'img/product/product-7.jpg' },
  { id: 6,  name: 'Shirt Blue',         price: 26.28, category: 'clothing',    image: 'img/product/product-8.jpg' },
  { id: 7,  name: 'Black Shirt',        price: 67.24, category: 'clothing',    image: 'img/product/product-9.jpg' },
  { id: 8,  name: 'Perfume',            price: 43.48, category: 'accessories', image: 'img/product/product-10.jpg' },
  { id: 9,  name: 'Backpack',           price: 60.90, category: 'bags',        image: 'img/product/product-11.jpg' },
  { id: 10, name: 'Hoody',              price: 98.49, category: 'clothing',    image: 'img/product/product-12.jpg' },
  { id: 11, name: 'Work Briefcase',     price: 49.66, category: 'bags',        image: 'img/product/product-13.jpg' },
  { id: 12, name: 'Glasses',            price: 26.28, category: 'glasses',     image: 'img/product/product-14.jpg' }
];

function renderShop() {
  const listEl = document.getElementById('product-list');
  listEl.innerHTML = products.map(p => `
    <div class="col-lg-3 col-md-6 col-sm-6">
      <div class="product__item">
        <div class="product__item__pic set-bg" data-setbg="${p.image}">
          <ul class="product__hover">
            <li><a href="#"><img src="img/icon/heart.png" alt=""></a></li>
            <li><a href="#"><img src="img/icon/compare.png" alt=""> <span>Compare</span></a></li>
            <li><a href="#"><img src="img/icon/search.png" alt=""></a></li>
          </ul>
        </div>
        <div class="product__item__text">
          <h6>${p.name}</h6>
          <a href="#" class="add-cart" data-id="${p.id}">+ Add To Cart</a>
          <div class="rating">
            <i class="fa fa-star-o"></i><i class="fa fa-star-o"></i>
            <i class="fa fa-star-o"></i><i class="fa fa-star-o"></i>
            <i class="fa fa-star-o"></i>
          </div>
          <h5>$${p.price.toFixed(2)}</h5>
          <div class="product__color__select">
            <label><input type="radio"></label>
            <label class="active black"><input type="radio"></label>
            <label class="grey"><input type="radio"></label>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  // เปลี่ยน .set-bg ให้เป็น background-image
  document.querySelectorAll('.set-bg').forEach(el => {
    el.style.backgroundImage = `url('${el.dataset.setbg}')`;
  });

  // ผูก event ให้ปุ่ม Add To Cart
  document.querySelectorAll('.add-cart').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const id = +btn.dataset.id;
      fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: id, quantity: 1 })
      })
      .then(r => r.json())
      .then(res => {
        if (res.success) alert('✅ เพิ่มสินค้าลงตะกร้าแล้ว');
        else          alert('❌ ' + (res.error||'Error'));
      })
      .catch(() => alert('❌ ไม่สามารถเชื่อมต่อ API ได้'));
    });
  });
}

window.addEventListener('DOMContentLoaded', renderShop);

