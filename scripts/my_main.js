$(document).ready(function()
{
	var logined=false;
	ac_status=getAccount();
	naviSet();
	if(location.pathname=='/users/user_change.html')
	{
		if(!ac_status){location.replace('/login.html')};
		userID=JSON.parse(localStorage.getItem('acdata'))['ID'];
		$('#user_name').append(userID);
		$('#change_button').button();
		$('#change_button').on('click',function(){
			var flag=true;
			old_psw=$('#old_psw').val();
			new_psw=$('#new_psw').val();
			confirm_psw=$('#confirm_psw').val();
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
						location.replace('/users/user_message.html');
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
	if(location.pathname=='/users/user_message.html')
	{
		if(!ac_status){location.replace('/login.html')};
		load_message();
		$('#tel_button').button();
		$('#mail_button').button();
		$('#tel_button').on('click',function(){
			changeUserMessage('#tel','tel');
		});
		$('#mail_button').on('click',function(){
			changeUserMessage('#email','email');
		});
	}
	if(location.pathname=='/users/user_return.html')
	{
		if(!ac_status){location.replace('/index.html')};
		loadReturn();
		$("#return_book_list").on('click',".return_button",function(){
			$.post('/book_service.php',{'action':'return','bid':$(this).attr('bid')},function(data,status){
				if(data=='1'){alert("您成功还了此借单的书。");loadReturn();}
				else if(data=='0'){alert("还书失败。");}
			});
		})
	}
	if(location.pathname=='/users/user_borrow.html')
	{
		if(!ac_status){location.replace('/index.html')};
		var borrow_list=localStorage.getItem('booksarray');
		if(!borrow_list)
		{
			borrow_list=[];
			localStorage.setItem('booksarray',JSON.stringify(borrow_list));
		}
		else
		{
			borrow_list=JSON.parse(borrow_list);
		}
		loadBorrow();
		$('#borrow_book_list').on('click',".borrow_delete_button",function()
		{
			for(i=0;i<borrow_list.length;i++)
			{
				var key=borrow_list[i];
				var value=JSON.parse(localStorage.getItem(key));
				if(value==$(this).parent().parent().children().html())
				{
					borrow_list.splice(i,1);
					localStorage.removeItem(key);
					localStorage.setItem('booksarray',JSON.stringify(borrow_list));
				}
			}
			loadBorrow();
		});
		$('#borrow_checkbutton').on('click',function()
		{
			var flag=true;
			var nums=0;
			books=[];
			if(borrow_list.length==0)
			{
				alert("请先到主页选想借的书，点“借它”按钮，再来这里点“借它们”按钮。记得把所有你想借的书都填进下面的列表里再点“借它们”按钮哦。");
				flag=false;
				location.replace('/index.html');
			}
			for(var i=0;i<borrow_list.length;i++)
			{
				ISBN=localStorage.getItem(borrow_list[i]);
				ISBN=JSON.parse(ISBN);
				num=document.getElementsByName('book_num_'+ISBN)[0].value;
				if(num<=0){flag=false;alert("不想借的书请点“不想借它了”按钮。");break;}
				temp={'ISBN':ISBN,'book_num':num};
				books.push(temp);
			}
			if(flag)
			{
				var data={'action':'borrow','books':books,'userID':JSON.parse(localStorage.getItem('acdata'))['ID']};
				$.post('/book_service.php',data,function(data,status)
				{
					data=JSON.parse(data)['code'];
					if(data[0]=='1')
					{
						alert('借阅成功');
						for(var i=0;i<borrow_list.length;i++)
						{
							localStorage.removeItem(borrow_list[i]);
						}
						borrow_list=[];
						localStorage.setItem('booksarray',JSON.stringify([]));
						location.replace('/users/user_return.html');
					}
					else if(data[0]=='0')
					{
						alert('没借成功，borrow没插入。');
					}
					else if(data[0]=='2')
					{
						alert('没借成功，book没插入。');
					}
					else if(data[0]=='3')
					{
						alert('您借的ISBN号为'+data[1]+'的书没货了，您可看好咯。');
					}
					else if(data[0]=='4')
					{
						alert('借多了，您最多借'+data[1]*5+'本书。您都借了'+data[2]+'本书了。请还书或者找管理员提升用户等级。');
					}
				});
			}
		});
	}
	if(location.pathname=='/users/user_board.html')
	{
		getTitles();
		getBoard();
	}
	if(location.pathname=='/login.html')
	{
		if(ac_status){location.replace('/index.html');}
		$("#login_button").button();
		$("#login_button").on('click',function()
		{	
			cuteID=document.getElementsByName('cuteID')[0].value;
			password=document.getElementsByName('password')[0].value;
			var data={'ID':cuteID,'password':password,'action':'login'};
			var check_flag=true;
			if([cuteID,password].indexOf('')!=-1)
			{
				alert('所有项都得填，注意点！');
				check_flag=false;
			}
			if(check_flag==true)
			{
				$.post($('#frm_login').attr('action'),data,function(data,status)
				{
					if(data=='1')
					{	
						alert('登录成功');
						var acdata={'ID':cuteID,'password':password};
						localStorage.setItem('acdata',JSON.stringify(acdata));
						logined=true;
						location.replace('/index.html');
					}
					else if(data=='2')
					{
						alert('登录成功');
						var acdata={'ID':cuteID,'password':password};
						localStorage.setItem('acdata',JSON.stringify(acdata));
						logined=true;
						location.replace('/admin/admin_books.html');
					}
					else
					{
						alert('用户名或密码错啦！');
					}
				});
			}
		});
	}
	if(location.pathname=='/users/regist.html')
	{
		if(ac_status){location.replace('/index.html');}
		$("#regist_button").button();
		$("#regist_radio").buttonset();
		$("input[name='birthday']").datepicker({ changeMonth: true, changeYear: true});
		$("#regist_button").on('click',function()
		{	
			cuteID=document.getElementsByName('cuteID')[0].value;
			password=document.getElementsByName('password')[0].value;
			password_confirm=document.getElementsByName('password2')[0].value;
			tel=document.getElementsByName('tel')[0].value;
			email=document.getElementsByName('email')[0].value;
			birthday=document.getElementsByName('birthday')[0].value;
			sex=$("input[name='sex']:checked").val();
			truename=document.getElementsByName('truename')[0].value;
			var check_flag=true;
			if([cuteID,password,password_confirm,tel,email,birthday,sex,truename].indexOf('')!=-1)
			{
				alert('所有项都得填，注意点！');
				check_flag=false;
			}
			if(tel.length!=11)
			{
				check_flag=false;
				alert('电话得是11位，注意点！');
			}
			if(password!=password_confirm)
			{
				check_flag=false;
				alert('两次密码输入不一样，注意点！');
			}
			if (check_flag==true)
			{
				var data={'cuteID':cuteID,'password':password,'tel':tel,'email':email,'birthday':birthday,'sex':sex,'truename':truename,'action':'regist'};
				$.post($('#frm_regist').attr('action'),data,function(data,status)
				{
					switch(data)
					{
						case '2':alert('用户名已经被注册了，换个吧。');break;
						case '1':
							{
								alert('注册成功！');
								var acdata={'ID':cuteID,'password':password};
								localStorage.setItem('acdata',JSON.stringify(acdata));
								logined=true;
								location.replace('/index.html');
								break;
							}
						case '0':alert('注册失败！');break;
					}
				});
			}
		});
	}
	function naviSet()
	{
		$('#navi_borrow').on('click',function()
		{
			if(logined)
			{
				$('#navi_borrow').attr('href','/users/user_borrow.html');
			}
			else
			{
				alert('您得先登录才能借书呀。');
			}
		});
		$('#navi_return').on('click',function()
		{
			if(logined)
			{
				$('#navi_return').attr('href','/users/user_return.html');
			}
			else
			{
				alert('您得先登录才能还书呀。');
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
				if(data=='1')
				{	
					$('#regist').empty();
					info="<a href='/users/user_message.html'>"+acdata.ID+"</a><a id='cancel_button' href='/index.html'>注销</a>"
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
	function getBoard()
	{
		id=location.search.replace("?id=","");
		$.getJSON("/board_service.php?action=getcontent&id="+id,function(json)
		{
			if(json.board.length>0)
			{
				$('#show_board').empty();
				$.each(json.board,function()
				{
					var info = "<article><h2>"+
						this['title']+"</h2><p>"+
						this['content']+'</p><p class="article_foot">发布于'+
						this['send_date']+'</p><p class="article_foot">最终修改于'+
						this['adj_date']+'</p>'+
						'</article>';
					$('#show_board').append(info);
				});
			}
		});
	}
	function getTitles()
	{
		$.getJSON("/board_service.php?action=getBoards",function(json)
		{
			if(json.boards.length>0)
			{
				$('#boards_list').empty();
				$.each(json.boards,function()
				{
					var info = "<li><a href='/users/user_board.html?id="+this['id']+"'>"+
						this['title']+
						'</a></li>';
					$('#boards_list').append(info);
				});
			}
		});
	}
	function getDBBooks()
	{	$.getJSON("/book_service.php?action=getBooks",function(json)
		{	if(json.books.length>0)
			{	$('#books_list').empty();
				$('#class_selecter').empty();
				$('#lang_selecter').empty();
				$('#class_selecter').append("<input type='radio' class='selecter' name='class_select' value='all' id='class_all'><label for='class_all'>所有</label>");
				$('#lang_selecter').append("<input type='radio' class='selecter' name='lang_select' value='all' id='lang_all'><label for='lang_all'>所有</label>");
				classes=[];
				langs=[];
				var info="<table><tr><th>ISBN</th><th>书名</th><th>作者</th><th>出版社</th><th>出版日期</th><th>分类</th><th>语言</th><th>书价</th><th>库存/本</th><th></th></tr>";
				$.each(json.books,function()
				{	
					if(!classes.includes(this['class']))
					{	classes.push(this['class']);
						$('#class_selecter').append("<input type='radio' class='selecter' name='class_select' id='class_"+classes.length+"' value='"+this['class']+"'><label for='class_"+classes.length+"'>"+this['class']+"</label>");
					}
					if(!langs.includes(this['books_language']))
					{	langs.push(this['books_language']);
						$('#lang_selecter').append("<input type='radio' class='selecter' name='lang_select' id='lang_"+langs.length+"' value='"+this['books_language']+"'><label for='lang_"+langs.length+"'>"+this['books_language']+"</label>");
					}
					info+='<tr><td>'+
						this['ISBN']+'</td><td>'+
						this['books_name']+'</td><td>'+
						this['author']+'</td><td>'+
						this['publisher']+'</td><td>'+
						this['publish_date']+'</td><td>'+
						this['class']+'</td><td>'+
						this['books_language']+'</td><td>'+
						this['price']+'</td><td>'+
						this['quantity']+'</td><td>'+
						"<input class='borrow_button' type='button' value='借他'>"+
						'</td></tr>';
				});
				info+="</table>";
				$('#books_list').append(info);
				$( "#class_selecter" ).buttonset();
				$( "#lang_selecter" ).buttonset();
				$('.borrow_button').button();
				//$('.borrow_button').css({'text-decoration':'none;','padding':'0.1em,2em','font_size':'0.5em'});
			}
		});
	}
	if(location.pathname=='/index.html')
	{
		$( "#search_button" ).button();
		class_select='all';
		lang_select='all';
		search_text='';
		getDBBooks();
		getTitles();
		$("#recm0").click(function()
		{
			$.getJSON("/book_service.php?action=getBooksbyID&id=9787020120130",function(json)
			{	if(json.books.length>0)
				{	books_to_DOM(json);
				}
				else
				{$('#books_list').empty();}
			});
		});
		$("#recm1").on('click',function()
		{
			$.getJSON("/book_service.php?action=getBooksbyID&id=9787040091373",function(json)
			{	if(json.books.length>0)
				{	books_to_DOM(json);
				}
				else
				{$('#books_list').empty();}
			});
		});

		$("#search_button").on('click',function()
		{	search_text=$("#search_text").val();
			$.getJSON("/book_service.php?action=getBooksbyClass&class="+class_select+"&lang="+lang_select+"&search="+search_text,function(json)
			{	if(json.books.length>0)
				{	books_to_DOM(json);
				}
				else
				{$('#books_list').empty();}
			});
		});
		$("#class_selecter").on('change','.selecter',function()
		{	class_select=$("input[name='class_select']:checked").val();
			$.getJSON("/book_service.php?action=getBooksbyClass&class="+class_select+"&lang="+lang_select+"&search="+search_text,function(json)
			{	if(json.books.length>0)
				{	books_to_DOM(json);
				}
				else
				{$('#books_list').empty();}
			});
		});
		$("#lang_selecter").on('change','.selecter',function()
		{	lang_select=$("input[name='lang_select']:checked").val();
			$.getJSON("/book_service.php?action=getBooksbyClass&class="+class_select+"&lang="+lang_select+"&search="+search_text,function(json)
			{	if(json.books.length>0)
				{	books_to_DOM(json);
				}
				else
				{$('#books_list').empty();}
			});
		});
		$("#books_list").on('click','.borrow_button',function()
		{	
			if(logined)
			{
				booksarray=localStorage.getItem('booksarray');
				if(!booksarray)
				{
					booksarray=[];
					localStorage.setItem('booksarray',JSON.stringify(booksarray));
				}
				else
				{
					booksarray=JSON.parse(booksarray);
				}
				var currentDate = new Date();
				var key = "book_" + currentDate.getTime();
				ISBN=JSON.stringify($(this).parent().parent().children().html());
				var flag=true;
				for(var i=0;i<booksarray.length;i++)
				{
					if(ISBN==localStorage.getItem(booksarray[i]))
					{
						flag=false;
						alert('这本书已经在你的列表里了。');
					}
				}
				if(flag)
				{
					localStorage.setItem(key,ISBN);
					booksarray.push(key);
					localStorage.setItem('booksarray',JSON.stringify(booksarray));
					location.replace('/users/user_borrow.html');
				}
			}
			else
			{
				alert('你得先登录才能借书，没号的话先注册一个。');
				location.replace('/login.html');
			}
		});
	}
	function books_to_DOM(json)
	{	$('#books_list').empty();
		var info="<table><tr><th>ISBN</th><th>书名</th><th>作者</th><th>出版社</th><th>出版日期</th><th>分类</th><th>语言</th><th>书价</th><th>库存/本</th><th></th></tr>";
		$.each(json.books,function()
		{	
			info+="<tr><td>"+
				this['ISBN']+'</td><td>'+
				this['books_name']+'</td><td>'+
				this['author']+'</td><td>'+
				this['publisher']+'</td><td>'+
				this['publish_date']+'</td><td>'+
				this['class']+'</td><td>'+
				this['books_language']+'</td><td>'+
				this['price']+'</td><td>'+
				this['quantity']+'</td><td>'+
				"<input class='borrow_button' type='button' value='借他'>"+
				'</td></tr>';
		});
		info+="</table>";
		$('#books_list').append(info);
		$('.borrow_button').button();
	}
	function loadBorrow()
	{
		$('#borrow_book_list').empty();
		var info1="";
		if(borrow_list.length==0)
		{
			info1+="<table><p>请到主页的借书列表点“借他”借书哦。</p>";
		}
		else{
		info1+="<p>选好了书，选好了借书量，就点下面的“借它们“按钮！</p><table id='borrow_table'><tr><th>ISBN</th><th>书名</th><th>作者</th><th>出版社</th><th>出版日期</th><th>分类</th><th>语言</th><th>书价</th><th>库存/本</th><th>欲借本数</th><th></th></tr>";
		}
		for(i=0;i<borrow_list.length;i++)
		{
			var key=borrow_list[i];
			var value=JSON.parse(localStorage.getItem(key));
			$.getJSON("/book_service.php?action=getBooksbyID&id="+value,function(json)
			{
				info1="<tr><td>"+
					json.books[0]['ISBN']+'</td><td>'+
					json.books[0]['books_name']+'</td><td>'+
					json.books[0]['author']+'</td><td>'+
					json.books[0]['publisher']+'</td><td>'+
					json.books[0]['publish_date']+'</td><td>'+
					json.books[0]['class']+'</td><td>'+
					json.books[0]['books_language']+'</td><td>'+
					json.books[0]['price']+'</td><td>'+
					json.books[0]['quantity']+'</td><td>'+
					"<input name='book_num_"+json.books[0]['ISBN']+"' type='number' value='1' min='1'></td><td>"+
					"<input class='borrow_delete_button' type='button' value='不想借它了'>"+
					'</td></tr>';
				$('#borrow_table').append(info1);
				$('.borrow_delete_button').button();
				$( "input[type='number']" ).spinner();
			});
		}
		if(borrow_list.length!=0)
		{info1+="</table><p><input type='submit' value='借它们！' id='borrow_checkbutton' ></p>";}
		$('#borrow_book_list').append(info1);
		$('#borrow_checkbutton').button();
	}
	function loadReturn()
	{
		userID=JSON.parse(localStorage.getItem('acdata'))['ID'];
		$.getJSON("/book_service.php?action=getBorrowedBooks&id="+JSON.stringify(userID),function(json)
		{	
			$('#return_book_list').empty();
			info="";
			if(json[0].length==0)
			{
				info+="<h4>您还没有需要还的书哦，快去借，多读书。</h4>";
			}
			else
			{
				for(var i=0;i<json[0].length;i++)
				{
					info+="<div class='user_return_show'><h4>下面是您于"+json[0][i]['books'][0]['borrow_date']+"借的书，要还的话点“还它们”按钮。</h4><table><tr><th>ISBN</th><th>书名</th><th>作者</th><th>出版社</th><th>出版日期</th><th>分类</th><th>语言</th><th>价格</th><th>本数</th></tr>";
					for(var j=0;j<json[0][i]['books'].length;j++)
					{
						info+="<tr><td>"+json[0][i]['books'][j]['ISBN']+"</td>"+
							"<td>"+json[0][i]['books'][j]['books_name']+"</td>"+
							"<td>"+json[0][i]['books'][j]['author']+"</td>"+
							"<td>"+json[0][i]['books'][j]['publisher']+"</td>"+
							"<td>"+json[0][i]['books'][j]['publish_date']+"</td>"+
							"<td>"+json[0][i]['books'][j]['class']+"</td>"+
							"<td>"+json[0][i]['books'][j]['books_language']+"</td>"+
							"<td>"+json[0][i]['books'][j]['price']+"</td>"+
							"<td>"+json[0][i]['books'][j]['quantity']+"</td>"+
							"</tr>";
					}
					info+="</table><p><input type='button' class='return_button' value='还它们' bid='"+json[0][i]['bid']+"'></p></div>";
				}
			}
			$('#return_book_list').append(info);
			$('.return_button').button();

			$('#returned_book_list').empty();
			info="";
			if(json[1].length==0)
			{
				info+="<h4>您还没有还过的书哦，快去借，多读书，别忘了还。</h4>";
			}
			else
			{
				info+="<div class='user_return_show'><h4>下面是您已经还了的书的记录。</h4><table><tr><th>借阅日期</th><th>归还日期</th><th>ISBN</th><th>书名</th><th>作者</th><th>出版社</th><th>出版日期</th><th>分类</th><th>语言</th><th>价格</th><th>本数</th></tr>";
				for(var i=0;i<json[1].length;i++)
				{
					for(var j=0;j<json[1][i]['books'].length;j++)
					{
						info+="<tr><td>"+json[1][i]['books'][j]['borrow_date']+"</td>"+
							"<td>"+json[1][i]['books'][j]['return_date']+"</td>"+
							"<td>"+json[1][i]['books'][j]['ISBN']+"</td>"+
							"<td>"+json[1][i]['books'][j]['books_name']+"</td>"+
							"<td>"+json[1][i]['books'][j]['author']+"</td>"+
							"<td>"+json[1][i]['books'][j]['publisher']+"</td>"+
							"<td>"+json[1][i]['books'][j]['publish_date']+"</td>"+
							"<td>"+json[1][i]['books'][j]['class']+"</td>"+
							"<td>"+json[1][i]['books'][j]['books_language']+"</td>"+
							"<td>"+json[1][i]['books'][j]['price']+"</td>"+
							"<td>"+json[1][i]['books'][j]['quantity']+"</td>"+
							"</tr>";
					}
				}
				info+="</table></div>";
			}
			$('#returned_book_list').append(info);
		});
	}
	function load_message()
	{
		userID=JSON.parse(localStorage.getItem('acdata'))['ID'];
		$('#user_name').append(userID);
		$.getJSON("/user_service.php?action=getusermessage&id="+userID,function(json){
			json=json[0];
			$('#true_name').append(json[2]['true_name']);
			$('#borrowed_num').append(json[0]);
			$('#borrow_num').append(json[1]);
			$('#can_borrow_num').append(json[2]['grade']*5);
			$('#user_grade').append(json[2]['grade']);
			$('#user_sex').append(json[2]['sex']=='1'?'男':'女');
			$('#tel_text').attr('value',json[2]['tel']);
			$('#user_email').append("<input type='text' id='email_text' readOnly='true' value='"+json[2]['email']+"'>");
			$('#user_birth').append(json[2]['birthday']);
		});
	}
	function changeUserMessage(button_id,propt)
	{
		if($(button_id+"_text").attr('readonly')=='readonly')
		{
			old_value=$(button_id+"_text").val();
			$(button_id+"_text").removeAttr('readonly');
			alert('请修改对应信息，修改后再次按下“更改”按钮。');
		}
		else
		{
			new_value=$(button_id+"_text").val();
			if(new_value==''){alert("您是要删除您的信息？不行哦。");}
			else if(new_value==old_value){alert('您这是改了个寂寞。');}
			else
			{
				data={'action':'updateusermessage','ID':JSON.parse(localStorage.getItem('acdata'))['ID'],'propt':propt,'newvalue':new_value};
				$.post('/user_service.php',data,function(data,status){
					if(data=='1')
					{
						alert('更改成功！');
						$(button_id+"_text").attr('readonly','readonly');
					}
					else if(data=='0'){alert('更改失败！');}
				});
			}
		}
	}
});