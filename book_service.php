<?php
$db_username="books_ma_users";
$db_password="120938";
$admin_username='books_ma_admin';
$admin_password="102938";
if($_POST)
{	
	if($_POST['action']=='delete_book')
	{
		$ISBN=$_POST['ISBN'];
		$query="SELECT books.books_id FROM borrow_book,books WHERE ISBN='$ISBN' AND borrow_book.books_id=books.books_id";
		$result=db_connect($query);
		if(!$result){echo '0';}
		else
		{
			if($result->num_rows > 0){echo '2';}
			else
			{
				$query="DELETE FROM books WHERE books_id=(SELECT a.books_id FROM (SELECT books_id FROM books WHERE ISBN='$ISBN') AS a)";
				$result=db_connect_admin($query);
				if(!$result){echo '0';}
				else{echo '1';}
			}
		}
	}
	if($_POST['action']=='change_book')
	{
		$bookname=$_POST['bookname'];
		$author=$_POST['author'];
		$publisher=$_POST['publisher'];
		$publishdate=$_POST['publish_date'];
		$class=$_POST['class'];
		$lang=$_POST['language'];
		$price=$_POST['price'];
		$quantity=$_POST['quantity'];
		$ISBN=$_POST['ISBN'];
		$query="UPDATE books SET books_name='$bookname',author='$author',publisher='$publisher',publish_date='$publishdate',class='$class',books_language='$lang',price=$price,quantity=$quantity WHERE books_id=(SELECT a.books_id FROM (SELECT books_id FROM books WHERE ISBN='$ISBN') AS a) ";
		$result=db_connect_admin($query);
		if(!$result){echo '0';}
		else{echo '1';}
	}
	if($_POST['action']=='add_book')
	{
		$ISBN=$_POST['ISBN'];
		$books_name=$_POST['books_name'];
		$author=$_POST['author'];
		$publisher=$_POST['publisher'];
		$publish_date=$_POST['publish_date'];
		$class=$_POST['bookclass'];
		$books_language=$_POST['language'];
		$price=$_POST['price'];
		$quantity=$_POST['quantity'];
		$query="SELECT books_id FROM books WHERE ISBN='$ISBN'";
		$result=db_connect($query);
		if($result->num_rows > 0)
		{
			echo '2';
		}
		else
		{
			$query="INSERT INTO books (ISBN,books_name,author,publisher,publish_date,class,books_language,price,quantity) 
				VALUES ('$ISBN','$books_name','$author','$publisher','$publish_date','$class','$books_language','$price','$quantity');";
			$result=db_connect_admin($query);
			if($result){echo '1';}
			else{echo '0';}
		}
	}
	if($_POST['action']=='return')
	{
		$bid=$_POST['bid'];
		$query="UPDATE borrow SET return_date=CURRENT_DATE() WHERE borrow_id=$bid;";
		$result=db_connect($query);
		if(!$result){$code="0";}
		else
		{
			$query="SELECT DISTINCT ISBN,borrow_book.quantity FROM books,borrow_book WHERE borrow_id=$bid AND books.books_id=borrow_book.books_id";
			$result=db_connect($query);
			while($row=$result->fetch_assoc())
			{
				$quantity=$row['quantity'];
				$ISBN=$row['ISBN'];
				db_connect("UPDATE books SET quantity=quantity+$quantity WHERE books_id=(SELECT a.books_id FROM(SELECT books_id FROM books WHERE ISBN='$ISBN') AS a);");
			}
			$code='1';
		}
		echo $code;
	}
	if($_POST['action']=='borrow')
	{
		$flag=true;
		$nums=0;
		$books=$_POST['books'];
		foreach($books as $book)
		{
			$query="SELECT IF(((SELECT quantity FROM books WHERE ISBN='";
			$query.=$book['ISBN'];
			$query.="')-";
			$query.=$book['book_num'];
			$query.=")>=0,true,false) AS result";
			$result=db_connect($query)->fetch_assoc()['result'];
			$nums+=$book['book_num'];
			if(!$result){$flag=false;$code=array('3',$book['ISBN']);break;}
		}
		$name=$_POST['userID'];
		$query="SELECT SUM(quantity) AS result FROM borrow,borrow_book WHERE borrow_book.borrow_id IN(SELECT borrow_id FROM borrow WHERE users_id=(SELECT users_id FROM users WHERE users_name='$name')) AND return_date IS NULL AND borrow.borrow_id=borrow_book.borrow_id";
		$borrowed=db_connect($query)->fetch_assoc()['result'];
		if(!$borrowed){$borrowed=0;}
		$query="SELECT IF((SELECT grade FROM users WHERE users_name='$name')*5-$nums-$borrowed>=0,true,false) AS result";
		$result=db_connect($query)->fetch_assoc()['result'];
		if(!$result)
		{
			$flag=false;
			$grade=db_connect("SELECT grade AS result FROM users WHERE users_name='$name'")->fetch_assoc()['result'];
			$code=array('4',$grade,$borrowed);
		}
		if($flag)
		{
			$query="INSERT INTO borrow (users_id,borrow_date) VALUES ((SELECT users_id FROM users WHERE users_name='".$_POST['userID']."'),current_date());";
			$ID=db_connect_returnID($query);
			if($ID)
			{
				$ID=$ID->fetch_assoc()['last_insert_id()'];
				foreach($books as $book)
				{
					$ISBN=$book['ISBN'];
					$book_num=$book['book_num'];
					$query="INSERT INTO borrow_book (borrow_id,books_id,quantity) VALUES ($ID,(SELECT books_id FROM books WHERE ISBN='$ISBN'),$book_num);";	
					$result=db_connect($query);
					if($result)
					{
						$query="UPDATE books SET quantity=quantity-$book_num WHERE books_id=(SELECT a.books_id FROM(SELECT books_id FROM books WHERE ISBN='$ISBN') AS a);";
						db_connect($query);
						$code=array('1');
					}
					else
					{
						$query="DELETE FROM borrow WHERE borrow_id=$ID";
						db_connect($query);
						$code=array('2');
					}
				}
			}
			else
			{
				$code=array('0');
			}
		}
		echo json_encode(array('code'=>$code));
	}
}
if($_GET)
{	
	if($_GET['action']=='get_borrowbyadmin')
	{
		$search_text=$_GET['search_text'];
		$returned=$_GET['returned'];
		$page_on=$_GET['page_on'];
		$query="SELECT users.users_id,users_name,borrow_date,return_date,ISBN,books_name,borrow_book.quantity FROM users,books,borrow,borrow_book 
			WHERE borrow.borrow_id=borrow_book.borrow_id AND books.books_id=borrow_book.books_id AND users.users_id=borrow.users_id ";
		if($returned!='all'){
			if($returned=='borrow'){
				$query.="AND return_date IS NULL ";
			}else{
				$query.="AND return_date IS NOT NULL ";
			}
		}

		if($page_on=='p1'){
			if($search_text!=''){$query.="AND concat(users.users_id,users_name,tel,email,true_name) REGEXP '$search_text' ";}
		}else if($page_on=='p2'){
			if($search_text!=''){$query.="AND concat(ISBN,books_name,publisher,author,class) REGEXP '$search_text' ";}
		}

		$query.="ORDER BY borrow_date DESC";
		$result=db_connect($query);
		$borrows=array();
		while($row=$result->fetch_assoc())
		{
			array_push($borrows,array('userid'=>$row['users_id'],'username'=>$row['users_name'],'borrow_date'=>$row['borrow_date'],'return_date'=>$row['return_date'],'ISBN'=>$row['ISBN'],'books_name'=>$row['books_name'],'quantity'=>$row['quantity']));
		}
		echo json_encode($borrows);
	}
	if($_GET['action']=='getBorrowedBooks')
	{
		$userid=$_GET['id'];
		$query="SELECT borrow_id FROM borrow WHERE users_id=(SELECT users_id FROM users WHERE users_name=$userid) AND return_date IS NULL";
		$result=db_connect($query);
		$borrow_id=array();
		while($row=$result->fetch_assoc())
		{
			array_push($borrow_id,$row['borrow_id']);
		}
		$borrow_books=array();
		foreach($borrow_id as $id)
		{
			$query="SELECT DISTINCT borrow_date,ISBN,books_name,author,publisher,publish_date,class,books_language,price,borrow_book.quantity";
			$query.=" FROM borrow,books,borrow_book";
			$query.=" WHERE borrow.borrow_id=$id AND borrow_book.borrow_id=borrow.borrow_id AND books.books_id=borrow_book.books_id";
			$result=db_connect($query);
			$books=array();
			while($row = $result->fetch_assoc())
			{
				array_push($books,array('borrow_date'=>$row['borrow_date'],'ISBN'=>$row['ISBN'],'books_name'=>$row['books_name'],'author'=>$row['author'],'publisher'=>$row['publisher'],'publish_date'=>$row['publish_date'],'class'=>$row['class'],'books_language'=>$row['books_language'],'price'=>$row['price'],'quantity'=>$row['quantity']));
			}
			array_push($borrow_books,array('bid'=>$id,'books'=>$books));
		}

		$query="SELECT borrow_id FROM borrow WHERE users_id=(SELECT users_id FROM users WHERE users_name=$userid) AND return_date IS NOT NULL";
		$result=db_connect($query);
		$return_id=array();
		while($row=$result->fetch_assoc())
		{
			array_push($return_id,$row['borrow_id']);
		}
		$return_books=array();
		foreach($return_id as $id)
		{
			$query="SELECT DISTINCT borrow_date,return_date,ISBN,books_name,author,publisher,publish_date,class,books_language,price,borrow_book.quantity";
			$query.=" FROM borrow,books,borrow_book";
			$query.=" WHERE borrow.borrow_id=$id AND borrow_book.borrow_id=borrow.borrow_id AND books.books_id=borrow_book.books_id";
			$result=db_connect($query);
			$books=array();
			if($result->num_rows==0){continue;}
			while($row = $result->fetch_assoc())
			{
				array_push($books,array('borrow_date'=>$row['borrow_date'],'return_date'=>$row['return_date'],'ISBN'=>$row['ISBN'],'books_name'=>$row['books_name'],'author'=>$row['author'],'publisher'=>$row['publisher'],'publish_date'=>$row['publish_date'],'class'=>$row['class'],'books_language'=>$row['books_language'],'price'=>$row['price'],'quantity'=>$row['quantity']));
			}
			array_push($return_books,array('rid'=>$id,'books'=>$books));
		}

		echo json_encode(array($borrow_books,$return_books));
	}
	if($_GET['action']=='getBooks')
	{	$query="SELECT books_id,ISBN,books_name,author,publisher,publish_date,class,books_language,price,quantity FROM books ORDER BY books_id ASC";
		$result=db_connect($query);
		if ($result->num_rows > 0) 
		{	$books=array();
			while($row = $result->fetch_assoc()) 
			{	array_push($books,array('books_id'=>$row['books_id'],'ISBN'=>$row['ISBN'],'books_name'=>$row['books_name'],'author'=>$row['author'],'publisher'=>$row['publisher'],'publish_date'=>$row['publish_date'],'class'=>$row['class'],'books_language'=>$row['books_language'],'price'=>$row['price'],'quantity'=>$row['quantity']));
    			}
			echo json_encode(array("books" => $books));
		}
		else
		{	echo "0 结果";
		}
	}
	if($_GET['action']=='getBooksbyID')
	{	$query="SELECT  books_id,ISBN,books_name,author,publisher,publish_date,class,books_language,price,quantity FROM books WHERE ISBN='";	$query.=$_GET['id'];	$query.="'";
		$result=db_connect($query);
		if ($result->num_rows > 0) 
		{	$books=array();
			while($row = $result->fetch_assoc()) 
			{	array_push($books,array('books_id'=>$row['books_id'],'ISBN'=>$row['ISBN'],'books_name'=>$row['books_name'],'author'=>$row['author'],'publisher'=>$row['publisher'],'publish_date'=>$row['publish_date'],'class'=>$row['class'],'books_language'=>$row['books_language'],'price'=>$row['price'],'quantity'=>$row['quantity']));
    			}
			echo json_encode(array("books" => $books));
		}
		else
		{	echo json_encode(array("books" => []));
		}
	}
	if($_GET['action']=='getBooksbyClass')
	{	$class=$_GET['class'];
		$lang=$_GET['lang'];
		$search=$_GET['search'];
		$query="SELECT books_id,ISBN,books_name,author,publisher,publish_date,class,books_language,price,quantity FROM books";
		if(strcasecmp($class,'all')!=0)
		{	$query.=" WHERE class='";	$query.=$class;	$query.="'";
			if(strcasecmp($lang,'all')!=0)
			{	$query.=" AND books_language='";	$query.=$lang;	$query.="'";
				if(strcasecmp($search,'')!=0)
					{$query.=" AND concat(ISBN,books_name,author,publisher) REGEXP '";	$query.=$search;	$query.="'";}
			}
			if(strcasecmp($search,'')!=0)
				{$query.=" AND concat(ISBN,books_name,author,publisher) REGEXP '";	$query.=$search;	$query.="'";}
		}
		else
		{	if(strcasecmp($lang,'all')!=0)
			{	$query.=" WHERE books_language='";	$query.=$lang;	$query.="'";
				if(strcasecmp($search,'')!=0)
					{$query.=" AND concat(ISBN,books_name,author,publisher) REGEXP '";	$query.=$search;	$query.="'";}
			}
			else
			{	if(strcasecmp($search,'')!=0)
					{$query.=" WHERE concat(ISBN,books_name,author,publisher,class,books_language) REGEXP '";	$query.=$search;	$query.="'";}
			}
		}
		$query.=' ORDER BY books_id ASC';
		$result=db_connect($query);
		if ($result->num_rows > 0) 
		{	$books=array();
			while($row = $result->fetch_assoc()) 
			{	array_push($books,array('books_id'=>$row['books_id'],'ISBN'=>$row['ISBN'],'books_name'=>$row['books_name'],'author'=>$row['author'],'publisher'=>$row['publisher'],'publish_date'=>$row['publish_date'],'class'=>$row['class'],'books_language'=>$row['books_language'],'price'=>$row['price'],'quantity'=>$row['quantity']));
    			}
			echo json_encode(array("books" => $books));
		}
		else
		{	$books=array();
			echo json_encode(array("books" => $books));
		}
	}
}
function db_connect($query)
{	global $db_username,$db_password;
	$con=mysqli_connect('127.0.0.1',$db_username,$db_password,'books_ma');
	if ($con->connect_error) 
	{	echo "连接 MySQL 失败: " . mysqli_connect_error();
	} 
	else
	{
	}
	$result=mysqli_query($con,$query);
	mysqli_close($con);
	return $result;
}	
function db_connect_returnID($query)
{
	global $db_username,$db_password;
	$con=mysqli_connect('127.0.0.1',$db_username,$db_password,'books_ma');
	if ($con->connect_error) 
	{	echo "连接 MySQL 失败: " . mysqli_connect_error();
	} 
	else
	{
	}
	$result=mysqli_query($con,$query);
	if($result)
	{	
		$ID=mysqli_query($con,"SELECT last_insert_id();");
		mysqli_close($con);
		return $ID;
	}
	else
	{
		return $result;
	}
}
function db_connect_admin($query)
{	global $admin_username,$admin_password;
	$con=mysqli_connect('127.0.0.1',$admin_username,$admin_password,'books_ma');
	if ($con->connect_error) 
	{	echo "连接 MySQL 失败: " . mysqli_connect_error();
	} 
	else
	{
	}
	$result=mysqli_query($con,$query);
	mysqli_close($con);
	return $result;
}
?>