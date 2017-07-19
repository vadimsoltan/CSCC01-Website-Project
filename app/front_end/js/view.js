var view = (function(){

    var view = {};
    document.getElementById("loginForm").onsubmit = function(e) {
        e.preventDefault();
        var data = {};
        data.username = document.getElementById("loginUsername").value;
        data.password = document.getElementById("loginPassword").value;
        document.dispatchEvent(new CustomEvent('login',{detail: data}));
        e.target.reset();
    }

    document.getElementById("registerForm").onsubmit = function(e) {
        e.preventDefault();
        if (document.getElementById("registerPassword").value != document.getElementById("confirmedPassword").value) {
            alert("password not same");
        } else {
            var data = {};
            data.username = document.getElementById("registerUsername").value;
            data.password = document.getElementById("registerPassword").value;
            data.email = document.getElementById("registerEmail").value;
            document.dispatchEvent(new CustomEvent('register',{detail: data}));
            e.target.reset();
        }
    }
    document.getElementById("signOut").onclick = function(e) {
        document.dispatchEvent(new CustomEvent('signOut'));
    }
    window.onload = function() {
        console.log(document.cookie);
        var username;
        for (var i=0;i < document.cookie.split(";").length; i++) {
            if (document.cookie.split(";")[i].split("=")[0].replace(/\s+/g, '') == "username") {
                username = document.cookie.split(";")[i].split("=")[1]
            }
        }
        if (username != "j%3Anull" && username != undefined) {
            document.dispatchEvent(new CustomEvent('stillLogin', {detail:username}));
        }
        document.dispatchEvent(new CustomEvent('createList'));
    }


    document.getElementById("userProfileForm").onsubmit = function(e) {
        e.preventDefault();
        if (document.getElementById("currentUser").textContent == "") {
            alert("Please login first!");
            document.getElementById("close2").click();
        } else {
            var reader = new FileReader();
            var fileURL = document.getElementById("selfie").files[0];
            if (fileURL == undefined) {
                alert("Please add image!");
            } else {
                reader.onload = function(){
                    var data = {};
                    data.name = document.getElementById("userName").value;
                    data.location = document.getElementById("userLocation").value;
                    data.email = document.getElementById("userEmail").value;
                    data.phone = document.getElementById("userPhone").value;
                    data.image = reader.result;
                    document.getElementById("userProfileForm").reset();
                    document.dispatchEvent(new CustomEvent('updateUserProfile',{detail: data}));
                };
                reader.readAsDataURL(fileURL);
            }
        }
        document.getElementById("close2").click();
    }

    document.getElementById("contactForm").onsubmit = function(e) {
        e.preventDefault();
        var data = {};
        data.name = document.getElementById("contactName").value;
        data.email = document.getElementById("contactEmail").value;
        data.subject = document.getElementById("contactSubject").value;
        data.message = document.getElementById("contactMessage").value;
        document.dispatchEvent(new CustomEvent('contactForm',{detail: data}));
        e.target.reset();
    }
    document.getElementById("postImg").onclick = function(e) {
        document.dispatchEvent(new CustomEvent('showUserProfile',{detail: null}));
    }

    document.getElementById("currentUser").onclick = function(e) {
        document.dispatchEvent(new CustomEvent('miniShowUserProfile',{detail: null}));
    }

    document.getElementById("myPosts").onclick = function(e) {
        if (document.getElementById("currentUser").textContent == "") {
            alert("Please login first!");
        } else {
            document.dispatchEvent(new CustomEvent('showMyPosts'));
            document.getElementById("postList").click();
            document.getElementById("returnAll").style.display = "block";
            document.getElementById("previous").style.display = "none";
            document.getElementById("next").style.display = "none";
        }
    }

    document.getElementById("returnAll").onclick = function(e) {
        document.getElementById("returnAll").style.display = "none";
        document.getElementById("previous").style.display = "block";
        document.getElementById("next").style.display = "block";
        document.dispatchEvent(new CustomEvent('createList'));
    }

    document.getElementById("makePostForm").onsubmit = function(e){
        e.preventDefault();
        if (document.getElementById("currentUser").textContent == "") {
            alert("Please login first!");
            document.getElementById("close3").click();
            document.getElementById("sign").click();
        } else {
            var reader = new FileReader();
            var fileURL = document.getElementById("uploadImage").files[0];
            if (fileURL == undefined) {
                alert("Please add image!");
            } else {
                // get data when reader onloading
                reader.onload = function(){
                    var data = {};
                    var dataURL = reader.result;
                    data.username = document.getElementById("currentUser1").textContent;
                    data.author = document.getElementById("author").value;
                    data.price = document.getElementById("price").value;
                    data.title = document.getElementById("title").value;
                    data.description = document.getElementById("description").value;
                    data.tags = [document.getElementById("type").value, document.getElementById("subject").value];
                    data.image = dataURL;
                    document.getElementById("makePostForm").reset();
                    document.dispatchEvent(new CustomEvent('createNewPost',{detail: data}));

                };
                // display the image
                reader.readAsDataURL(fileURL);
            }
        }
        document.getElementById("close3").click();
    }

    view.createList = function(data) {
        document.getElementById("postsList").innerHTML="";
        for (var i=0;i < data.length;i++) {
            var id = data[i]._id;
            var title = data[i].title;
            var author = data[i].author;
            var description = data[i].description;
            var date = data[i].createdAt.split("T",1);
            var price = data[i].price;
            var url = "post_profile.html?id=" + data[i]._id
            var grey = "#BEBEBE";
            var lightgrey = "#DCDCDC";
            var color;
            if (i % 2 == 0) {
                color = grey;
            }else {
                color = lightgrey;
            }
            var e;
            e = document.createElement('div');
            e.id = data[i]._id;
            e.innerHTML = `<div href>
                            <li><table width="100%" border="0" cellspacing="0" cellpadding="0" > 
                                <tbody><tr bgcolor=${color}>
                                    <td width="14%" valign="top" height="50">
                                      <p style="color:black;"><a class="post_profile" href="post_profile.html?id=${id}" >${title}</p>
                                    </td>
                                    <td width="14%" valign="top">
                                      <p style="color:black;">${author}</p>
                                    </td>
                                    <td width="36%" valign="top">
                                      <p style="color:black;">${description}</p>
                                    </td>
                                    <td width="12%" valign="top">
                                      <p style="color:black;">${date}</p>
                                    </td>
                                    <td width="10%" valign="top">
                                      <p style="color:black;">${price}</p>
                                    </td>
                                    <td width="12%" valign="top" id="contact${id}">
                                      <p style="color:black;"> <a class="login-window" href="#login-box">Contact</a></p>
                                    </td>
                                </tr></tbody>
                            </table><ul class="inner-content" style="display: none;"></li>
                        </div>`
            document.getElementById("postsList").appendChild(e);
            document.getElementById("contact" + e.id).onclick = function() {
                if (document.getElementById("currentUser").textContent == "") {
                    alert("Please login first!");
                    document.getElementById("close3").click();
                    document.getElementById("sign").click();
                } else {
                    document.dispatchEvent(new CustomEvent("contact",{detail:e.id}));
                }
            }
        }
    }
    document.getElementById("next").onclick = function() {
        var lastId = document.getElementById("postsList").lastChild.id
        if (document.getElementById("status").textContent == "") {
            document.dispatchEvent(new CustomEvent("next",{detail:lastId}));
        } else {
            data = {}
            data.lastId = lastId;
            data.info = document.getElementById("status").textContent;
            document.dispatchEvent(new CustomEvent("nextSearch",{detail:data}));
        }
    }

    document.getElementById("previous").onclick = function() {
        var firstId = document.getElementById("postsList").firstChild.id;
        if (document.getElementById("status").textContent == "") {
            document.dispatchEvent(new CustomEvent("previous",{detail:firstId}));
        } else {
            data = {}
            data.firstId = firstId;
            data.info = document.getElementById("status").textContent;
            document.dispatchEvent(new CustomEvent("previousSearch",{detail:data}));
        }
    }

    document.getElementById("search").onclick = function() {
        var info = document.getElementById("txtBookSearch").value;
        document.getElementById("returnAll").style.display = "block";
        document.getElementById("status").textContent = info;
        if (info === "") {
            alert("Please enter information of book");
        } else {
            document.dispatchEvent(new CustomEvent("search",{detail:info}));
        }

        //document.dispatchEvent(new CustomEvent("previous",{detail:firstId}));
    }



    









    return view;

}());