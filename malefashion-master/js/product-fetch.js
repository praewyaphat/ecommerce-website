document.addEventListener("DOMContentLoaded", function () {
  const productList = document.getElementById("product-list");
  const searchInput = document.getElementById("search-input");

  function renderProducts(products) {
    console.log("✅ โหลดสินค้า:", products);
    productList.innerHTML = "";

    if (!Array.isArray(products)) {
      productList.innerHTML = "<p class='text-danger'>เกิดข้อผิดพลาด</p>";
      return;
    }

    if (products.length === 0) {
      productList.innerHTML = "<p class='text-center'>ไม่พบสินค้า</p>";
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
              <a href="#" class="add-cart" data-id="${p.id}">+ Add To Cart</a>
            </div>
          </div>
        </div>
      `);
    });

    document.querySelectorAll(".set-bg").forEach(el => {
      el.style.backgroundImage = `url(${el.getAttribute("data-setbg")})`;
    });

    // ✅ ผูก event add-to-cart
    productList.querySelectorAll(".add-cart").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        e.preventDefault();
        const id = btn.dataset.id;
        console.log("🛒 กดสินค้า ID:", id);

        const response = await fetch('/api/check-login', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });

        const result = await response.json();

        if (result.loggedIn) {

        btn.disabled = true;
        btn.textContent = "กำลังเพิ่ม...";

        fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: parseInt(id), quantity: 1 })
        })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            alert("✅ เพิ่มลงตะกร้าแล้ว");
            window.location.href = "shopping-cart.html";
          } else {
            alert("❌ " + (data.error || "เกิดข้อผิดพลาด"));
          }
        })
        .catch(err => {
          console.error("❌ fetch error:", err);
          alert("❌ เกิดข้อผิดพลาดในการเชื่อมต่อ");
        })
        .finally(() => {
          btn.disabled = false;
          btn.textContent = "+ Add To Cart";
        });
      }else{
            $('#loginModal').modal('show');
        }
      });
    });
  }

  // โหลดสินค้าจาก SQLite
  fetch("/api/products")
    .then(res => res.json())
    .then(renderProducts)
    .catch(err => {
      console.error("โหลดสินค้าไม่สำเร็จ:", err);
      renderProducts([]);
    });

  // ค้นหาจาก popup
if (searchInput) {
  searchInput.addEventListener("keypress", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      const keyword = searchInput.value.trim();
      if (!keyword) return;

      fetch(`/api/search?keyword=${encodeURIComponent(keyword)}`)
        .then(res => res.json())
        .then(products => {
          renderProducts(products);

          // ✅ ปิด popup หน้าดำ
          const searchModel = document.querySelector(".search-model");
          if (searchModel) {
            searchModel.classList.remove("active");
            searchModel.style.display = "none";
          }
          document.body.classList.remove("search-show");

          // ✅ Scroll กลับมาที่ product list
          const section = document.getElementById("product-list");
          if (section) {
            section.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        })
        .catch(err => {
          console.error("ค้นหาไม่สำเร็จ:", err);
          renderProducts([]);
        });
    }
  });
}

});
