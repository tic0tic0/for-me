/*
[rewrite]
https:\/\/69shuba\.cx\/txt\/55175\/35697240.* url script-response-body script.js

[mitm]
69shuba.cx

*/

let body = $response.body;

if (/<\/html>|<\/body>/.test(body)) {
  body = body.replace('</body>', `

<script>
(function() {
    const loadWindowSize = 1.6; // 控制多早加载下一章
    let nextPageLoading = false;
    let nextChapterURL = document.querySelector('a#pb_next').href; // 获取下一章的URL

    function requestNextChapter() {
        if (!nextChapterURL) return;

        nextPageLoading = true;
        let msg = document.createElement('div');
        msg.style.position = 'fixed';
        msg.style.bottom = '0';
        msg.style.left = '0';
        msg.style.padding = '5px 10px';
        msg.style.background = 'darkred';
        msg.style.color = 'white';
        msg.style.fontSize = '11px';
        msg.innerText = 'Loading next chapter...';
        document.body.appendChild(msg);

        fetch(nextChapterURL)
            .then(response => response.text())
            .then(text => {
                let parser = new DOMParser();
                let htmlDocument = parser.parseFromString(text, "text/html");
                let content = htmlDocument.querySelector('.content'); // 假设内容在 .content 元素中
                let newChapterURL = htmlDocument.querySelector('a#pb_next')?.href;

                if (content) {
                    let chapterDiv = document.createElement('div');
                    chapterDiv.className = 'next-chapter';
                    chapterDiv.appendChild(content);
                    document.querySelector('.content').parentNode.appendChild(chapterDiv);
                }

                nextChapterURL = newChapterURL; // 更新下一章的URL
                document.body.removeChild(msg); // 移除加载提示
                nextPageLoading = false;

                if (!nextChapterURL) {
                    window.removeEventListener('scroll', onScrollDocumentEnd); // 如果没有更多章节，停止监听滚动事件
                }
            })
            .catch(() => {
                document.body.removeChild(msg); // 移除加载提示
                nextPageLoading = false;
            });
    }

    function onScrollDocumentEnd() {
        let y = window.scrollY;
        if (!nextPageLoading && (y + window.innerHeight * loadWindowSize >= document.body.clientHeight)) {
            requestNextChapter();
        }
    }

    function init() {
        window.addEventListener('scroll', onScrollDocumentEnd);
    }

    document.addEventListener('DOMContentLoaded', init);
})();
</script></body>`);
}

$done({ body });
