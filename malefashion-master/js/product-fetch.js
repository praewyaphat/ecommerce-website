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
  fetch("http://localhost:3000/products")
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

        fetch(`http://localhost:3000/search?keyword=${encodeURIComponent(keyword)}`)
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
