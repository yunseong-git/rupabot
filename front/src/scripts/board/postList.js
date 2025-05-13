document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("search-input");
    const searchBtn = document.getElementById("search-button");
    const sortSelect = document.getElementById("sort-select");
    const postList = document.getElementById("post-list");
    const pagination = document.getElementById("page-numbers");
    const tabButtons = document.querySelectorAll(".tab");

    let currentPage = 1;
    let currentSort = "latest";
    let currentKeyword = "";
    let currentType = "";

    function getPageOffset(page, limit = 10) {
        return (page - 1) * limit;
    }

    async function fetchPosts() {
        const skip = getPageOffset(currentPage);

        const queryParams = [`skip=${skip}`, `sort=${currentSort}`];
        if (currentType) queryParams.push(`type=${currentType}`);
        const query = currentKeyword
            ? `/posts/search?word=${currentKeyword}&${queryParams.join('&')}`
            : `/posts?${queryParams.join('&')}`;

        const res = await fetch(query);
        const data = await res.json();
        renderPosts(data.data);
        renderPagination();
    }

    function renderPosts(posts) {
        postList.innerHTML = "";
        posts.forEach((post, index) => {
            const row = document.createElement("tr");

            const numberCell = document.createElement("td");
            numberCell.innerText = index + 1;

            const titleCell = document.createElement("td");
            titleCell.innerText = post.title;
            titleCell.classList.add("post-title");
            titleCell.addEventListener("click", () => {
                window.location.href = `/pages/board/post?id=${post._id}`;
            });

            const authorCell = document.createElement("td");
            authorCell.innerText = `${post.userTag.nickname} (${post.userTag.rank})`;

            const dateCell = document.createElement("td");
            const createdDate = new Date(post.createdAt);
            dateCell.innerText = createdDate.toLocaleDateString("ko-KR");

            const viewCell = document.createElement("td");
            viewCell.innerText = post.viewcount;

            const likeCell = document.createElement("td");
            likeCell.innerText = post.likecount;

            row.appendChild(numberCell);
            row.appendChild(titleCell);
            row.appendChild(authorCell);
            row.appendChild(dateCell);
            row.appendChild(viewCell);
            row.appendChild(likeCell);

            postList.appendChild(row);
        });
    }

    function renderPagination() {
        pagination.innerHTML = "";
        for (let i = 2; i <= 10; i += 2) {
            const btn = document.createElement("button");
            btn.innerText = i;
            btn.addEventListener("click", () => {
                currentPage = i;
                fetchPosts();
            });
            pagination.appendChild(btn);
        }
    }

    searchBtn.addEventListener("click", () => {
        currentKeyword = searchInput.value;
        currentPage = 1;
        fetchPosts();
    });

    sortSelect.addEventListener("change", () => {
        currentSort = sortSelect.value;
        fetchPosts();
    });

    tabButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            currentType = btn.dataset.type;
            currentPage = 1;
            fetchPosts();
        });
    });

    fetchPosts();
});