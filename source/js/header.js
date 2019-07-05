(() => {
  const searchBtn = document.querySelector('#site-search'),
    searchListBtn = document.querySelector('.site-layer-input-choose > a'),
    nav = document.querySelector('#site-nav'),
    navBtn = document.querySelector('#site-nav-btn'),
    layer = document.querySelector('#site-layer'),
    layerContent = layer.querySelector('.site-layer-content'),
    title = document.querySelector('#site-layer-title'),
    searchDOM = document.querySelector('#site-layer-search');

  const inputDOM = searchDOM.querySelector('input'),
    iconDOM = searchDOM.querySelector('i');

  let platformIndex = 0,
    platforms = [
      'Google',
      'BaiDu',
      'Bing'
    ];

  searchBtn.addEventListener('click', (e) => {
    layer.style.display = 'block';
    searchDOM.style.display = 'flex';
    inputDOM.focus();
    title.innerHTML = '搜索';

    window.AD_CONFIG.layer.add(() => {
      title.innerHTML = '';
      inputDOM.blur();
      searchDOM.style.display = 'none';
    });
  });

 /* searchListBtn.addEventListener('click', (e) => {
    platformIndex = (platformIndex + 1) % platforms.length
    searchListBtn.innerHTML = platforms[platformIndex] + ''
  })*/

  inputDOM.addEventListener('keypress', (e) => {
    let key = e.which || e.keyCode,
      value = inputDOM.value.trim();

    if(key === 13 && value.length > 0) {
      openSearch(value);
    }
  });

  iconDOM.addEventListener('click', (e) => {
    inputDOM.focus();
    let value = inputDOM.value.trim();
    if(value.length > 0) {
      openSearch(value);
    }
  });

  navBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    layer.style.display = 'block';
    layerContent.style.display = 'none';
    nav.style.right = '0';

    window.AD_CONFIG.layer.add(() => {
      nav.style.right = '';
      layer.style.display = 'none';
      layerContent.style.display = '';
    });
  });

  function openSearch(keywords) {
  /*  keywords = `site:${window.location.hostname} ${decodeURIComponent(keywords)}`;
    let href = null;
    switch (platforms[platformIndex]) {
      case 'BaiDu':
        href = `https://www.baidu.com/s?wd=${keywords}`;
        break;
      case 'Bing':
        href = `https://cn.bing.com/search?q=${keywords}&FORM=BESBTB&ensearch=1`;
        break;
      default:
        href = `https://www.google.com/search?q=${keywords}`;
        break;
    }
    window.open(href);*/

  }
  var searchFunc = function(path, search_id, content_id) {
    'use strict'; //使用严格模式
    $.ajax({
        url: path,
        dataType: "xml",
        success: function( xmlResponse ) {
            // 从xml中获取相应的标题等数据
            var datas = $( "entry", xmlResponse ).map(function() {
                return {
                    title: $( "title", this ).text(),
                    content: $("content",this).text(),
                    url: $( "url" , this).text()
                };
            }).get();
            //ID选择器
            var $input = document.getElementById(search_id);
            var $resultContent = document.getElementById(content_id);
            $input.addEventListener('input', function(){
                var str='<ul class=\"search-result-list my_fav_list\">';                
                var keywords = this.value.trim().toLowerCase().split(/[\s\-]+/);
                $resultContent.innerHTML = "";
                if (this.value.trim().length <= 0) {
                    return;
                }
                // 本地搜索主要部分
                datas.forEach(function(data) {
                    var isMatch = true;
                    var content_index = [];
                    var data_title = data.title.trim().toLowerCase();
                    var data_content = data.content.trim().replace(/<[^>]+>/g,"").toLowerCase();
                    var data_url = data.url;
                    var index_title = -1;
                    var index_content = -1;
                    var first_occur = -1;
                    // 只匹配非空文章
                    if(data_title != '' && data_content != '') {
                        keywords.forEach(function(keyword, i) {
                            index_title = data_title.indexOf(keyword);
                            index_content = data_content.indexOf(keyword);
                            if( index_title < 0 && index_content < 0 ){
                                isMatch = false;
                            } else {
                                if (index_content < 0) {
                                    index_content = 0;
                                }
                                if (i == 0) {
                                    first_occur = index_content;
                                }
                            }
                        });
                    }
                    // 返回搜索结果
                    if (isMatch) {
                    //结果标签
                        str += "<li class=\"my_fav_list_li\"><a href='"+ data_url +"' class='my_fav_list_a search-result-title'>" + data_title +"</a>";
                        var content = data.content.trim().replace(/<[^>]+>/g,"");
                        if (first_occur >= 0) {
                            // 拿出含有搜索字的部分
                            var start = first_occur - 6;
                            var end = first_occur + 6;
                            if(start < 0){
                                start = 0;
                            }
                            if(start == 0){
                                end = 10;
                            }
                            if(end > content.length){
                                end = content.length;
                            }
                            var match_content = content.substr(start, end); 
                            // 列出搜索关键字，定义class加高亮
                            keywords.forEach(function(keyword){
                                var regS = new RegExp(keyword, "gi");
                                match_content = match_content.replace(regS, "<em class=\"search-keyword\">"+keyword+"</em>");
                            })
                            str += "<small class=\"search-result\">"+" -- "+ match_content +"...</small></li>"
                        }
                    }
                })
                $resultContent.innerHTML = str;
            })
        }
    })
};
var path = "../search.xml";
searchFunc(path, 'local-search-input', 'local-search-result');
})();