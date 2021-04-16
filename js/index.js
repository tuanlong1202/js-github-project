const gitSearchForm = document.getElementById('github-form');
const searchText = document.getElementById('search');
const userList = document.getElementById('user-list');
const repList = document.getElementById('repos-list');

document.addEventListener('DOMContentLoaded', function () {
    gitSearchForm.addEventListener('submit', function (event) {
        event.preventDefault();
        refreshAll();
        //
        if (searchText.value != '') {
            if (searchForUser()) {
                loadUsers(searchText.value);
            } else {
                searchRepositories(searchText.value);
            }
        }
    })
})

// Load users match search criteria

function loadUsers(strSearch) {
    // building search URL
    let searchURL = 'https://api.github.com/search/users?q=' + strSearch.trim();
    // fetch users by fetch()
    removeAllChildNodes(userList); // clear previously result
    fetch(searchURL)
        .then(response => response.json())
        .then(function(result) {
            // 
            let items = result.items;
            items.forEach(function(item) {
                //
                let div = document.createElement('div');
                let imgAvatar = document.createElement('img');
                imgAvatar.src = item.avatar_url;
                div.appendChild(imgAvatar);
                div.appendChild(createBR());
                div.appendChild(createText(item.login.toUpperCase()));
                div.appendChild(createBR());
                div.appendChild(createLink(item.html_url,'Profile '));
                let linkRep = createLink('','Repos '); // Create Repos link
                linkRep.addEventListener('click', function(event) {
                    event.preventDefault();
                    loadRep(item.login);
                })
                div.appendChild(linkRep);
                userList.appendChild(div);
            })
        })
        .catch(function(error){
            alert(error.message);
        });
}

function loadRep(strLoginName) {
    // Build URL
    let repURL = `https://api.github.com/users/${strLoginName}/repos`;
    removeAllChildNodes(repList); // clear previously result
    fetch(repURL)
        .then(response=>response.json())
        .then(function(result) {
            if (Array.isArray(result)) {
                result.forEach(function(rep){
                    //
                    let div = document.createElement('div');
                    repoLink = createLink(rep.html_url,rep.name);
                    div.appendChild(repoLink);
                    repList.appendChild(div);
                })
    
            } else {
                alert(result.message);
            }
        })
        .catch(function(e) {
            alert(e.message);
        })
}

function searchRepositories(strKeyWord) {
    // Build search URL
    let strQueryString = 'q=' + encodeURIComponent(`user:${strKeyWord}`);
    let repURL = 'https://api.github.com/search/repositories?' + strQueryString;
    removeAllChildNodes(repList);
    fetch(repURL)
        .then(response=>response.json())
        .then(function(result) {
            if (Array.isArray(result.items)){
                let items = result.items;
                items.forEach(function(item) {
                    let div = document.createElement('div');
                    repoLink = createLink(item.html_url,item.name);
                    div.appendChild(repoLink);
                    repList.appendChild(div);
                })    
            } else {
                alert(result.message);
            }
        })
        .catch(function(error) {
            alert(error.message);
        })
}

function refreshAll () {
    removeAllChildNodes(userList);
    removeAllChildNodes(repList);
}

function searchForUser() {
    let searchType = document.getElementById('radio_user');
    if (searchType.checked) {
        return true;
    }
    return false;
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function createBR () {
    return document.createElement('br');
}

function createText(strText) {
    return document.createTextNode(strText);
}

function createLink(strURL,strText,strTarget = 'blank'){
    let aLink = document.createElement('a');
    aLink.target = strTarget;
    aLink.href = strURL;
    aLink.textContent = strText;
    return aLink;
}
