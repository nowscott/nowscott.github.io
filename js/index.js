window.onload = function () {
    var sources
    var taglist = []
    var onlist = []
    var url = "https://www.nowscott.top/home/source/sources.json"/*json文件url，本地的就写本地的位置，如果是服务器的就写服务器的路径*/
    var request = new XMLHttpRequest();
    function unique(arr) {/*数组去重方法的定义*/
        return Array.from(new Set(arr))
    }
    request.open("get", url);/*设置请求方法与路径*/
    request.send(null);/*不发送数据到服务器*/
    request.onload = function () {/*XHR对象获取到返回信息后执行*/
        if (request.status == 200) {/*返回状态为200，即为数据获取成功*/
            sources = JSON.parse(request.responseText);
        }
        var soulist = []
        sources.forEach(s => {
            if (s.name != '') {
                soulist.push(s)
            }
        })

        //自动切换夜间模式
        var currentTime = new Date();// 创建一个 Date 对象
        var currentHour = currentTime.getHours();// 获取当前时间（小时）
        // 如果当前时间在晚上 23 点到早上 8 点之间，则进入夜间模式
        if (currentHour >= 22 || currentHour < 8) {
            // 更改页面的背景颜色为深色
            document.getElementById('darkcss').href = "./css/dark.css"
            document.getElementById('icon').src = './svg/moon.svg'
        } else {
            document.getElementById('darkcss').href = "./css/daytime.css"
            document.getElementById('icon').src = './svg/sun.svg'
        }
        //夜间模式按钮功能
        document.getElementById('darkbtn').onclick = function () {
            if (document.getElementById('darkbtn').className == 'daytime') {
                document.getElementById('darkbtn').className = 'dark'
                document.getElementById('darkcss').href = "./css/dark.css"
                document.getElementById('icon').src = './svg/moon.svg'
            } else {
                document.getElementById('darkbtn').className = 'daytime'
                document.getElementById('darkcss').href = "./css/daytime.css"
                document.getElementById('icon').src = './svg/sun.svg'
            }
        }
        //创建随机函数
        function randomSort(arr) {
            for (let i = 0, l = arr.length; i < l; i++) {
                let rc = parseInt(Math.random() * l)
                // 让当前循环的数组元素和随机出来的数组元素交换位置
                const empty = arr[i]
                arr[i] = arr[rc]
                arr[rc] = empty
            }
            return arr
        }
        soulist = randomSort(soulist)
        for (s in soulist) {
            var a = document.createElement('a')
            a.id = 'web'
            a.href = soulist[s].web
            a.target = '_blank'
            a.innerHTML = soulist[s].name
            a.title = soulist[s].brief
            document.getElementById('webs-container').appendChild(a)
        }
        sources.forEach(w => {
            for (let i = 0; i < w.tags.length; i++) {
                if (w.name != '') {
                    taglist.push(w.tags[i])
                }
            }
        })
        taglist = unique(taglist)
        taglist = randomSort(taglist)
        for (let i = 0; i < taglist.length; i++) {
            var button = document.createElement('button')
            button.id = 'tag' + i
            button.innerHTML = taglist[i]
            button.className = 'tag off'
            document.getElementById('tags-container').appendChild(button)
            document.getElementById('tag' + i).onclick = function () {
                if (document.getElementById('tag' + i).className == 'tag off') {
                    document.getElementById('tag' + i).className = 'tag on'
                    onlist.push(document.getElementById('tag' + i).textContent)
                } else {
                    document.getElementById('tag' + i).className = 'tag off'
                    onlist.splice(onlist.indexOf(document.getElementById('tag' + i).textContent), 1)
                }
                var weblist = []
                sources.forEach(w => {
                    if (onlist.filter(function (val) { return w.tags.indexOf(val) > -1 }).length == onlist.length) {
                        if (w.name != '') {
                            weblist.push(w)
                        }
                    }
                })
                weblist = randomSort(weblist)
                document.getElementById('webs-container').innerHTML = ''
                if (weblist.length == 0) {
                    document.getElementById('webs-container').innerHTML = '未找到符合条件的网页'
                }
                for (w in weblist) {
                    var a = document.createElement('a')
                    a.id = 'web'
                    a.href = weblist[w].web
                    a.target = '_blank'
                    a.innerHTML = weblist[w].name
                    a.title = weblist[w].brief
                    document.getElementById('webs-container').appendChild(a)
                }
            }
        }
        document.getElementById('s-btn').onclick = function () {
            var keyword = document.getElementById('s-in').value
            keyword = keyword.toLowerCase();
            var reslist = []
            //遍历资源搜索
            sources.forEach(s => {
                n = s.name.toLowerCase()
                b = s.brief.toLowerCase()
                if (n.indexOf(keyword) !== -1 || b.indexOf(keyword) !== -1) {
                    if (s.name != '') {
                        reslist.push(s)
                    }
                }
                for (t in s.tags) {
                    tag = s.tags[t].toLowerCase()
                    if (tag.indexOf(keyword) !== -1) {
                        reslist.push(s)
                    }
                }
            })
            reslist = unique(reslist)
            reslist = randomSort(reslist)
            document.getElementById('webs-container').innerHTML = ''
            if (reslist.length == 0) {
                document.getElementById('webs-container').innerHTML = '未找到符合条件的网页'
            }
            for (r in reslist) {
                var a = document.createElement('a')
                a.id = 'web'
                a.href = reslist[r].web
                a.target = '_blank'
                a.innerHTML = reslist[r].name
                a.title = reslist[r].brief
                document.getElementById('webs-container').appendChild(a)
            }
        }
        document.addEventListener('keydown', event => {
            if (event.keyCode === 13) {
                // 按下了回车键，执行搜索
                document.getElementById('s-btn').click()
            }
        })
    }
}
