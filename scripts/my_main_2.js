$(document).ready(function()
{
    var logined=false;
	ac_status=getAccount();
    if(location.pathname=='/admin/admin_change.html')
    {
        $('#psw_button').button();
        if(!ac_status){location.replace('/index.html');}
        userID=JSON.parse(localStorage.getItem('acdata'))['ID'];
        $('#aname').empty();$('#aname').append(userID);
        $('#psw_button').on('click',function(){
            old_psw=document.getElementById('old_password').value;
			new_psw=document.getElementById('new_password').value;
			confirm_psw=document.getElementById('psw_confirm').value;
            var flag=true;
			if(new_psw!=confirm_psw)
			{
				alert("两次密码输入不一样！");
				flag=false;
			}
			if([old_psw,new_psw,confirm_psw].indexOf('')!=-1)
			{
				alert('所有项都得填，注意点！');
				flag=false;
			}
			if(flag)
			{
				data={'action':'changepsw','old_psw':old_psw,'new_psw':new_psw,'id':userID};
				$.post('/user_service.php',data,function(data,status){
					if(data=='1')
					{
						alert('改密成功！');
						var acdata={'ID':userID,'password':new_psw};
						localStorage.setItem('acdata',JSON.stringify(acdata));
						location.replace("/admin/admin_books.html");
					}
					else if(data=='0')
					{
						alert('改密失败！');
					}
					else if(data=='2')
					{
						alert('密码错误，改密失败！');
					}
					else if(data=='3')
					{
						alert('您改了个寂寞。');
					}
				});
			}
        });
    }
    if(location.pathname=='/admin/admin_borrow.html')
    {
        if(!ac_status){location.replace('/index.html');}
        $("#tabs").tabs();
        $('#tabs').css({'background-color':'rgba(207, 128, 142, 0.85)'})
        $('#p1_sbutton').button();
        $('#p2_sbutton').button();
        $('.radio_set').buttonset();
        page_on='p1';
        search_text_book='';
        search_text_user='';
        returned_book='all';
        returned_user='all';
        $('#p2').css('display','none');
        $('#p2_b').on('click',function(){
            $('#p2').css('display','block');
            $('#p1').css('display','none');
            page_on='p2';
            $.getJSON('/book_service.php?action=get_borrowbyadmin&search_text='+search_text_book+'&returned='+returned_book+'&page_on='+page_on,function(json){
                borrow_to_page(json,page_on);
            });
        });
        $('#p1_b').on('click',function(){
            $('#p1').css('display','block');
            $('#p2').css('display','none');
            page_on='p1';
            $.getJSON('/book_service.php?action=get_borrowbyadmin&search_text='+search_text_user+'&returned='+returned_user+'&page_on='+page_on,function(json){
                borrow_to_page(json,page_on);
            });
        });
        $.getJSON('/book_service.php?action=get_borrowbyadmin&search_text='+search_text_user+'&returned='+returned_user+'&page_on='+page_on,function(json){
            borrow_to_page(json,page_on);
        });
        $("input[name='p1_isreturned']").on('change',function(){
            returned_user=$("input[name='p1_isreturned']:checked").val();
            $.getJSON('/book_service.php?action=get_borrowbyadmin&search_text='+search_text_user+'&returned='+returned_user+'&page_on='+page_on,function(json){
                borrow_to_page(json,page_on);
            });
        });
        $("input[name='p2_isreturned']").on('change',function(){
            returned_book=$("input[name='p2_isreturned']:checked").val();
            $.getJSON('/book_service.php?action=get_borrowbyadmin&search_text='+search_text_book+'&returned='+returned_book+'&page_on='+page_on,function(json){
                borrow_to_page(json,page_on);
            });
        });
        $('#p1_sbutton').on('click',function(){
            search_text_user=$('#p1_text').val();
            $.getJSON('/book_service.php?action=get_borrowbyadmin&search_text='+search_text_user+'&returned='+returned_user+'&page_on='+page_on,function(json){
                borrow_to_page(json,page_on);
            });
        });
        $('#p2_sbutton').on('click',function(){
            search_text_book=$('#p2_text').val();
            $.getJSON('/book_service.php?action=get_borrowbyadmin&search_text='+search_text_book+'&returned='+returned_book+'&page_on='+page_on,function(json){
                borrow_to_page(json,page_on);
            });
        });
    }
    if(location.pathname=='/admin/admin_board.html')
    {
        if(!ac_status){location.replace('/index.html');}
        $('#p0').css('display','none');
        $('#p2').css('display','none');
        $('#change_b').on('click',function(){
            $('#p2').css('display','block');
            $('#p1').css('display','none');
            $('#p0').css('display','none');
        });
        $('#add_b').on('click',function(){
            $('#p1').css('display','block');
            $('#p2').css('display','none');
            $('#p0').css('display','none');
        });
        $('#tabs').tabs();
        $('#board_button').button();
        $('#date_button').button();
        $('#p0_button').button();
        $('#date_picker').datepicker({changeMonth: true, changeYear: true});
        $('#tabs').css({'background-color':'rgba(207, 128, 142, 0.85)'})
        $('#board_button').on('click',function(){
            b_title=$('#board_title').val();
            b_board=$('#board').val();
            flag=true;
            if(b_title==''||b_board==''){alert("标题，正文不能空白。");flag=false;}
            if(flag)
            {
                $.post('/board_service.php',{'action':'release','title':b_title,'board':b_board},function(data){
                    if(data=='1')
                    {
                        alert('发布成功！');
                        $('#p2').css('display','block');
                        $('#p1').css('display','none');
                        $.getJSON('/board_service.php?action=getallboards',function(json){
                            loadBoard(json);
                        });
                    }
                    else{alert('发布失败！');}
                });
            }
        });
        $.getJSON('/board_service.php?action=getallboards',function(json){
            loadBoard(json);
        });
        $('#date_button').on('click',function(){
            b_date=$('#date_picker').val();
            if(b_date!=''){
                $.getJSON('/board_service.php?action=getboardsbydate&date='+b_date,function(json){
                    loadBoard(json);
                });
            }
            else{
                $.getJSON('/board_service.php?action=getallboards',function(json){
                    loadBoard(json);
                });
            }
        });
        $('#boards_list').on('click','.change_b',function(){
            $('#p1').css('display','none');
            $('#p2').css('display','none');
            $('#p0').css('display','block');
            bid=$(this).attr('bid');
            $('#p0_button').attr('bid',bid);
            $.getJSON('/board_service.php?action=getboardbyid&id='+bid,function(json){
                if(json=='fail'){alert('错误！');}
                else{
                    $('#p0_title').attr('value',json[0]['title']);
                    $('#p0_board').empty();
                    $('#p0_board').append(json[0]['content']);
                }
            });
        });
        $('#p0_button').on('click',function(){
            new_title=$('#p0_title').val();
            new_content=$('#p0_board').val();
            bid=$(this).attr('bid');
            if([new_title,new_content].indexOf('')!=-1){alert('不能输入空！');}
            else{
                $.post('/board_service.php',{"action":'change_board','id':bid,'title':new_title,'content':new_content},function(data){
                    if(data=='1'){
                        alert('修改成功');
                        $('#p2').css('display','block');
                        $('#p1').css('display','none');
                        $('#p0').css('display','none');
                        $.getJSON('/board_service.php?action=getallboards',function(json){
                            loadBoard(json);
                        });
                    }
                    else{
                        alert('修改失败！');
                    }
                })
            }
        });
        $('#boards_list').on('click','.delete_b',function(){
            bid=$(this).attr('bid');
            $.post("/board_service.php",{'action':'delete_board','id':bid},function(data){
                if(data=='1'){
                    alert('删除成功！');
                    $.getJSON('/board_service.php?action=getallboards',function(json){
                        loadBoard(json);
                    });
                }
                else{
                    alert('删除失败');
                }
            });
        });
        $('#p0_return').on('click',function(){
            $('#p2').css('display','block');
            $('#p1').css('display','none');
            $('#p0').css('display','none');
        });
    }
    if(location.pathname=='/admin/admin_users.html')
    {
        if(!ac_status){location.replace('/index.html');}
        $('#p0').css('display','none');
        $('#p0_button').button();
        $('#search_button').button();
        $.getJSON('/user_service.php?action=getallusers',function(json){
            users_to_page(json);
        });
        $('#search_button').on('click',function(){
            search_text=$('#search_text').val();
            if(search_text=='')
            {
                $.getJSON('/user_service.php?action=getallusers',function(json){
                    users_to_page(json);
                });
            }
            else
            {
                $.getJSON('/user_service.php?action=getusersbysearch&text='+search_text,function(json){
                    users_to_page(json);
                });
            }
        });
        $('#users_show').on('click','.change_code',function(){
            uid=$(this).attr('uid');
            $('#p11').css('display','none');
            $('#p0').css('display','block');
            $('#p0_userID').append(uid);
            $('#p0_button').on('click',function(){
                psw=$('#p0_psw').val();
                var flag=true;
                if(psw!=$('#p0_psw_cfm').val()){alert('两次密码输入不一样！');flag=false;}
                if([psw,$('#p0_psw_cfm').val()].indexOf('')!=-1){alert('请输入密码！');flag=false;}
                if(flag)
                {
                    data={'action':'reset_psw','uid':uid,'psw':psw};
                    $.post('/user_service.php',data,function(data){
                        if(data=='1')
                        {
                            alert('重置成功！');
                            $('#p0').css('display','none');
                            $('#p11').css('display','block');
                        }
                        else if(data=='0')
                        {
                            alert('重置失败！');
                        }
                    });
                }
            });
        });
        $('#users_show').on('click','.change_msg',function(){
            uid=$(this).attr('uid');
            if($('.user_'+uid).attr('readonly')=='readonly')
            {
                $('.user_'+uid).removeAttr('readonly');
                alert('请在框中修改对应用户'+uid+'的信息。');
            }
            else
            {
                u_name=$('#name_'+uid).val();
                u_grade=$("#grade_"+uid).val();
                u_tel=$('#tel_'+uid).val();
                u_email=$('#email_'+uid).val();
                u_birthday=$('#birthday_'+uid).val();
                u_sex=$('#sex_'+uid).val();
                u_true_name=$('#true_name_'+uid).val();
                var flag=true;
                if(u_sex=='男'){u_sex=1;}else if(u_sex=="女"){u_sex=2;}else{alert('性别只能为男或女。');flag=false;}
                if(u_tel.length!=11||isNaN(u_tel)){alert('电话必为11位数字。');flag=false;}
                if(u_grade<=0){alert('用户等级只能是大于1的数字。');flag=false;}
                if([u_name,u_grade,u_tel,u_email,u_birthday,u_sex,u_true_name].indexOf('')!=-1){alert('不能有空。');flag=false;}
                if(flag)
                {
                    data={'action':'change_user','UID':uid,'u_name':u_name,'u_grade':u_grade,'u_tel':u_tel,'u_email':u_email,'u_birthday':u_birthday,'u_sex':u_sex,"u_true_name":u_true_name};
                    $.post('/user_service.php',data,function(data){
                        if(data=='1')
                        {
                            alert('更改成功！');
                            $('.user_'+uid).attr('readonly','readonly');
                        }
                        else if(data=='0')
                        {
                            alert('更改失败！');
                        }
                    });
                }
            }
        });
        $('#users_show').on('click','.delete_user',function(){
            $.post('/user_service.php',{'action':'delete_user','uid':$(this).attr('uid')},function(data){
                if(data=='1')
                {
                    alert('删除成功。');
                    $.getJSON('/user_service.php?action=getallusers',function(json){
                        users_to_page(json);
                    });
                }
                else if(data=='0'){alert('删除失败。');}
                else if(data=='2'){alert('此用户还有书没还，无法删除。请先让他还书。');}
            });
        });
    }
    if(location.pathname=='/admin/admin_books.html')
    {
        $('#tabs').tabs();
        $('#search_button').button();
        $('#tabs').css({'background-color':'rgba(207, 128, 142, 0.85)'})
        $('#add_book_button').button();
        $('input[name="publish_date"]').datepicker({changeMonth: true, changeYear: true});
        if(!ac_status){location.replace('/index.html');}
        $('#p2').css('display','none');
        $('#add_page').on('click',function(){
            $('#p1').css('display','block');
            $('#p2').css('display','none');
        });
        $('#change_page').on('click',function(){
            $('#p1').css('display','none');
            $('#p2').css('display','block');
        });
        $('#add_book_button').on('click',function(){
            ISBN=document.getElementsByName('ISBN')[0].value;
			books_name=document.getElementsByName('bookname')[0].value;
			author=document.getElementsByName('author')[0].value;
			publisher=document.getElementsByName('publisher')[0].value;
			publish_date=document.getElementsByName('publish_date')[0].value;
			bookclass=document.getElementsByName('bookclass')[0].value;
			language=document.getElementsByName('booklang')[0].value;
			price=document.getElementsByName('price')[0].value;
            quantity=document.getElementsByName('quantity')[0].value;
            var flag=true;
            if(ISBN.length!=13){alert('ISBN值必为13位！');flag=false;}
            if([ISBN,books_name,author,publisher,publish_date,bookclass,language,price,quantity].indexOf('')!=-1)
			{
				alert('所有项都得填，注意点！');
				flag=false;
			}
            if(isNaN(ISBN)){alert('ISBN必须是13位数字！');flag=false;}
            if(isNaN(price)){alert('价格必须是数字！（元）');flag=false;}
            if(isNaN(quantity)){alert('库存必须是数字！');flag=false;}
            if(flag)
            {
                data={'action':'add_book','ISBN':ISBN,'books_name':books_name,'author':author,'publisher':publisher,'publish_date':publish_date,'bookclass':bookclass,'language':language,'price':price,'quantity':quantity};
                $.post('/book_service.php',data,function(data,status){
                    if(data=='1'){
                        alert('添加成功！');
                        getbooks_to_page();
                    }
                    else if(data=='2'){alert('ISBN重复！');}
                    else{'添加失败！';}
                });
            }
        });
        getbooks_to_page();
        $('#books_show').on('click','.change_button',function(){
            tISBN=$(this).attr('bid');
            if($('.book_msg_'+tISBN).attr('readonly')=='readonly')
            {
                $('.book_msg_'+tISBN).removeAttr('readonly');
                alert('请在框中修改对应书'+tISBN+'的信息。');
            }
            else
            {   
                books_name=$("#bookname_"+tISBN).val();
                author=$("#author_"+tISBN).val();
                publisher=$("#publisher_"+tISBN).val();
                publish_date=$("#publish_date_"+tISBN).val();
                bookclass=$("#bookclass_"+tISBN).val();
                language=$("#booklang_"+tISBN).val();
                price=$("#price_"+tISBN).val();
                quantity=$("#quantity_"+tISBN).val();
                var flag=true;
                if(isNaN(price)){alert('价格必须是数字！（元）');flag=false;}
                if([books_name,author,publisher,publish_date,bookclass,language,price,quantity].indexOf('')!=-1)
			    {
                    alert('所有项都得填，注意点！');
                    flag=false;
			    }
                if(flag)
                {
                    data={'action':'change_book','ISBN':tISBN,'bookname':$("#bookname_"+tISBN).val(),'author':$("#author_"+tISBN).val(),'publisher':$("#publisher_"+tISBN).val(),'publish_date':$("#publish_date_"+tISBN).val(),'class':$("#bookclass_"+tISBN).val(),'language':$("#booklang_"+tISBN).val(),'price':$("#price_"+tISBN).val(),'quantity':$("#quantity_"+tISBN).val()};
                    $.post("/book_service.php",data,function(data,status){
                        if(data=='1'){alert('修改成功！');getbooks_to_page();}
                        else if(data=='0'){alert ('修改失败！');}
                    });
                    $('.book_msg_'+tISBN).attr('readonly','readonly');
                }
            }
        });
        $('#books_show').on('click','.delete_button',function(){
            tISBN=$(this).attr('bid');
            data={'action':'delete_book','ISBN':tISBN};
            $.post("/book_service.php",data,function(data,status){
                if(data=='1'){alert('下架书籍成功！');}
                else if(data=='0'){alert ('下架书籍失败！');}
                else if(data=='2'){alert ('所有的这书都还没还完，要还完才能删该书！');}
                else{alert(data);}
            });
        });
        $('#search_button').on('click',function(){
            search_text=document.getElementById('search_text').value;
            if(search_text=='')
            {
                getbooks_to_page();
            }
            else
            {
                $.getJSON("/book_service.php?action=getBooksbyClass&class=all&lang=all&search="+search_text,function(json){
                    $('#books_show').empty();
                    if(json.books.length>0)
                    {
                        var info="<table><tr><th>ISBN</th><th>书名</th><th>作者</th><th>出版社</th><th>出版日期</th><th>分类</th><th>语言</th><th>书价</th><th>库存/本</th><th></th><th></th></tr>";
                        $.each(json.books,function()
                        {	
                            info+="<tr>"+
                                "<td><input name='ISBN' type='text' readOnly='true' value='"+this['ISBN']+"'></td>"+
                                "<td><input name='bookname' type='text' readOnly='true' id='bookname_"+this['ISBN']+"' class='book_msg_"+this['ISBN']+"' value='"+this['books_name']+"'></td>"+
                                "<td><input name='author' type='text' readOnly='true' id='author_"+this['ISBN']+"' class='book_msg_"+this['ISBN']+"' value='"+this['author']+"'></td>"+
                                "<td><input name='publisher' type='text' readOnly='true' id='publisher_"+this['ISBN']+"' class='book_msg_"+this['ISBN']+"' value='"+this['publisher']+"'></td>"+
                                "<td><input name='publish_date' type='date' readOnly='true' id='publish_date_"+this['ISBN']+"' class='book_msg_"+this['ISBN']+"' value='"+this['publish_date']+"'></td>"+
                                "<td><input name='bookclass' type='text' readOnly='true' id='bookclass_"+this['ISBN']+"' class='book_msg_"+this['ISBN']+"' value='"+this['class']+"'></td>"+
                                "<td><input name='booklang' type='text' readOnly='true' id='booklang_"+this['ISBN']+"' class='book_msg_"+this['ISBN']+"' value='"+this['books_language']+"'></td>"+
                                "<td><input name='price' type='text' readOnly='true' id='price_"+this['ISBN']+"' class='book_msg_"+this['ISBN']+"' value='"+this['price']+"'></td>"+
                                "<td><input name='quantity' type='number' readOnly='true' id='quantity_"+this['ISBN']+"' class='book_msg_"+this['ISBN']+"' value='"+this['quantity']+"'></td>"+
                                "<td><input class='change_button' type='button' value='改书' bid='"+this['ISBN']+"'></td>"+
                                "<td><input class='delete_button' type='button' value='删书' bid='"+this['ISBN']+"'></td>"+
                                '</tr>';
                        });
                        info+="</table>";
                        $('#books_show').append(info);
                    }
                });
            }
        });
    }
    function getAccount()
    {
        var acdata=localStorage.getItem("acdata");
		if(acdata)
		{
			acdata = JSON.parse(acdata);
			data={'ID':acdata.ID,'password':acdata.password,'action':'login'};
			$.post('/user_service.php',data,function(data,status)
			{
				if(data=='2')
				{	
					$('#regist').empty();
					info="您好，管理员<a href='/admin/admin_change.html'>"+acdata.ID+"</a><a id='cancel_button' href='/index.html'>注销</a>"
					$('#regist').append(info);
					logined=true;
					$('#cancel_button').on('click',function()
					{
						localStorage.clear();
						logined=false;
					});
				}
				else
				{
					alert('登录信息过期，请重新登录。');
					localStorage.clear();
					location.replace('/login.html');
				}
			});
			return true;
		}
		else
		{
			return false;
		}
    }
    function getbooks_to_page()
    {   
        $.getJSON("/book_service.php?action=getBooks",function(json){
            $('#books_show').empty();
            var info="<table><tr><th>ISBN</th><th>书名</th><th>作者</th><th>出版社</th><th>出版日期</th><th>分类</th><th>语言</th><th>书价</th><th>库存/本</th><th></th><th></th></tr>";
            $.each(json.books,function()
            {	
                info+="<tr>"+
                    "<td><input name='ISBN' type='text' readOnly='true' value='"+this['ISBN']+"'></td>"+
                    "<td><input name='bookname' type='text' readOnly='true' id='bookname_"+this['ISBN']+"' class='book_msg_"+this['ISBN']+"' value='"+this['books_name']+"'></td>"+
                    "<td><input name='author' type='text' readOnly='true' id='author_"+this['ISBN']+"' class='book_msg_"+this['ISBN']+"' value='"+this['author']+"'></td>"+
                    "<td><input name='publisher' type='text' readOnly='true' id='publisher_"+this['ISBN']+"' class='book_msg_"+this['ISBN']+"' value='"+this['publisher']+"'></td>"+
                    "<td><input name='publish_date' type='date' readOnly='true' id='publish_date_"+this['ISBN']+"' class='book_msg_"+this['ISBN']+"' value='"+this['publish_date']+"'></td>"+
                    "<td><input name='bookclass' type='text' readOnly='true' id='bookclass_"+this['ISBN']+"' class='book_msg_"+this['ISBN']+"' value='"+this['class']+"'></td>"+
                    "<td><input name='booklang' type='text' readOnly='true' id='booklang_"+this['ISBN']+"' class='book_msg_"+this['ISBN']+"' value='"+this['books_language']+"'></td>"+
                    "<td><input name='price' type='text' readOnly='true' id='price_"+this['ISBN']+"' class='book_msg_"+this['ISBN']+"' value='"+this['price']+"'></td>"+
                    "<td><input name='quantity' type='number' readOnly='true' id='quantity_"+this['ISBN']+"' class='book_msg_"+this['ISBN']+"' value='"+this['quantity']+"'></td>"+
                    "<td><input class='change_button' type='button' value='改书' bid='"+this['ISBN']+"'></td>"+
                    "<td><input class='delete_button' type='button' value='删书' bid='"+this['ISBN']+"'></td>"+
                    '</tr>';
            });
            info+="</table>";
            $('#books_show').append(info);
        });
    }
    function users_to_page(json)
    {
        $('#users_show').empty();
        if(json=='fail'){alert('连接错误！');}
        else
        {
            var info="<table><tr><th>用户ID</th><th>昵称</th><th>等级</th><th>电话</th><th>邮箱</th><th>生日</th><th>性别</th><th>真名</th><th></th><th></th><th></th></tr>";
            $.each(json.users,function(){
                sex=(this['sex']==1)?'男':'女';
                info+="<tr>"+
                    "<td>"+this['users_id']+"</td>"+
                    "<td><input readOnly='true' type='text' value='"+this['users_name']+"' id='name_"+this['users_id']+"' class='user_"+this['users_id']+"'></td>"+
                    "<td><input readOnly='true' type='number' value='"+this['grade']+"' id='grade_"+this['users_id']+"' class='user_"+this['users_id']+"'></td>"+
                    "<td><input readOnly='true' type='tel' value='"+this['tel']+"' id='tel_"+this['users_id']+"' class='user_"+this['users_id']+"'></td>"+
                    "<td><input readOnly='true' type='email' value='"+this['email']+"' id='email_"+this['users_id']+"' class='user_"+this['users_id']+"'></td>"+
                    "<td><input readOnly='true' type='date' value='"+this['birthday']+"' id='birthday_"+this['users_id']+"' class='user_"+this['users_id']+"'></td>"+
                    "<td><input readOnly='true' type='text' value='"+sex+"' id='sex_"+this['users_id']+"' class='user_"+this['users_id']+"'></td>"+
                    "<td><input readOnly='true' type='text' value='"+this['true_name']+"' id='true_name_"+this['users_id']+"' class='user_"+this['users_id']+"'></td>"+
                    "<td><input class='change_code' type='button' value='重置密码' uid='"+this['users_id']+"'></td>"+
                    "<td><input class='change_msg' type='button' value='改信息' uid='"+this['users_id']+"'></td>"+
                    "<td><input class='delete_user' type='button' value='删除用户' uid='"+this['users_id']+"'></td>"+
                    "</tr>";
            });
            info+="</table>";
            $('#users_show').append(info);
        }
    }
    function loadBoard(json)
    {
        $('#boards_list').empty();
        if(json=='fail'){alert('错误');}
        else{
            var info="";
            if(json.length>0){
                $.each(json,function(){
                    info+="<li class='admin_oneboard'><article><h3>"+this['title']+"</h3><p>"+this['content']+"</p><p class='article_foot'>发布于"+this['send_date']+"</p><p class='article_foot'>最终修改于"+this['adj_date']+"</p><ul id='icons' class='ui-widget ui-helper-clearfix'><li class='ui-state-default ui-corner-all'><span class='change_b ui-icon ui-icon-wrench' bid='"+this['id']+"'>修改</span></li><li class='ui-state-default ui-corner-all'><span class='delete_b ui-icon ui-icon-scissors' bid='"+this['id']+"'>删除</span></li></ul></article></li>";
                });
            }
            else{
                info+="<li>无公告。</li>";
            }
            $('#boards_list').append(info);
            $( "#icons li" ).hover(
                function() {
                    $( this ).addClass( "ui-state-hover" );
                },
                function() {
                    $( this ).removeClass( "ui-state-hover" );
                }
            );
        }
    }
    function borrow_to_page(json,page_on)
    {
        $('#'+page_on+'_show').empty();
        if(json=='fail'){alert('错误');}
        else{
            var info="";
            if(json.length>0){
                info+="<table><tr><th>用户ID</th><th>昵称</th><th>借阅日</th><th>归还日</th><th>书ISBN</th><th>书名</th><th>数量</th></tr>";
                $.each(json,function(){
                    info+="<tr><td>"+this['userid']+"</td><td>"+this['username']+"</td><td>"+this['borrow_date']+"</td><td>"+this['return_date']+"</td><td>"+this['ISBN']+"</td><td>"+this['books_name']+"</td><td>"+this['quantity']+"</td></tr>";
                });
                info+="</table>";
            }
            else{
                info+="<p>无结果。</p>";
            }
            $('#'+page_on+'_show').append(info);
        }
    }
});