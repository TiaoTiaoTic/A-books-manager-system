<?php
$db_username="books_ma_users";
$db_password="120938";
$admin_username='books_ma_admin';
$admin_password="102938";
if($_POST)
{	
	if($_POST['action']=='delete_user')
	{
		$uid=$_POST['uid'];
		$query="SELECT borrow_book.books_id FROM borrow,borrow_book WHERE borrow.users_id=$uid AND borrow_book.borrow_id=borrow.borrow_id AND borrow.return_date IS NULL";
		$result=db_connect($query);
		if($result->num_rows>0)
		{
			echo '2';
		}
		else if(!$result){echo '0';}
		else
		{
			$query="SELECT borrow_id FROM borrow WHERE users_id='$uid'";
			$result=db_connect($query);
			if($result->num_rows==0)
			{
				$query="DELETE FROM users WHERE users_id=$uid";
				$result=db_connect_admim($query);
				if(!$result){echo '0';}
				else{echo '1';}
			}
			else if(!$result){echo '0';}
			else
			{
				while($row=$result->fetch_assoc())
				{
					$temp=$row['borrow_id'];
					db_connect_admim("DELETE FROM borrow_book WHERE borrow_id=$temp");
					db_connect_admim("DELETE FROM borrow WHERE borrow_id=$temp");
				}
				if(!db_connect_admim("DELETE FROM users WHERE users_id=$uid")){echo '0';}
				else{echo '1';}
			}
		}

	}
	if($_POST['action']=='change_user')
	{
		$uid=$_POST['UID'];
		$u_name=$_POST['u_name'];
		$u_grade=$_POST['u_grade'];
		$u_tel=$_POST['u_tel'];
		$u_email=$_POST['u_email'];
		$u_birthday=$_POST['u_birthday'];
		$u_sex=$_POST['u_sex'];
		$u_true_name=$_POST['u_true_name'];
		$query="UPDATE users SET users_name='$u_name',grade='$u_grade',tel='$u_tel',email='$u_email',birthday='$u_birthday',sex='$u_sex',true_name='$u_true_name' WHERE users_id=$uid";
		$result=db_connect($query);
		if(!$result){echo '0';}
		else{echo '1';}
	}
	if($_POST['action']=='reset_psw')
	{
		$uid=$_POST['uid'];
		$psw=$_POST['psw'];
		$query="UPDATE users SET users_password='$psw' WHERE users_id=$uid";
		$result=db_connect($query);
		if(!$result){echo '0';}
		else{echo '1';}
	}
	if($_POST['action']=='changepsw')
	{
		$uname=$_POST['id'];
		$new_psw=$_POST['new_psw'];
		$old_psw=$_POST['old_psw'];
		$query="SELECT users_id FROM users WHERE users_name='$uname' AND users_password='$old_psw'";
		$result=db_connect($query);
		if($result->num_rows>0)
		{
			if($new_psw==$old_psw){echo '3';}
			else
			{
				$query="UPDATE users SET users_password='$new_psw' WHERE users_id=(SELECT a.users_id FROM (SELECT users_id FROM users WHERE users_name='$uname') AS a)";
				$result=db_connect($query);
				if(!$result){echo '0';}
				else{echo '1';}
			}
		}
		else
		{
			echo '2';
		}
	}
	if($_POST['action']=='updateusermessage')
	{
		$uid=$_POST['ID'];
		$propt=$_POST['propt'];
		$newvalue=$_POST['newvalue'];
		$query="UPDATE users SET $propt='$newvalue' WHERE users_id=(SELECT a.users_id FROM (SELECT users_id FROM users WHERE users_name='$uid') AS a)";
		$result=db_connect($query);
		if(!$result){echo '0';}
		else{echo '1';}
	}
	if(htmlspecialchars($_POST['action'])=='regist')
	{
		$cuteID=htmlspecialchars($_POST['cuteID']);
		$password=htmlspecialchars($_POST['password']);
		$tel=htmlspecialchars($_POST['tel']);
		$email=htmlspecialchars($_POST['email']);
		$birthday=htmlspecialchars($_POST['birthday']);
		$sex=htmlspecialchars($_POST['sex']);
		$truename=htmlspecialchars($_POST['truename']);
		$query="SELECT users_name FROM users WHERE users_name='$cuteID'";
		$result = db_connect($query);
		if ($result->num_rows > 0)
		{
			echo '2';
		}
		else
		{
			$query = "INSERT INTO users (users_name, users_password, tel, email, birthday, sex, true_name ) ";
			$query .= "VALUES ('$cuteID', '$password', '$tel', '$email', '$birthday', '$sex', '$truename') ";
			$result = db_connect($query);
			if ($result) {
				echo '1';
			} else {
				echo '0';
			}
		}
	}
	if(htmlspecialchars($_POST['action'])=='login')
	{
		$cuteID=htmlspecialchars($_POST['ID']);
		$password=htmlspecialchars($_POST['password']);
		$query = "SELECT grade FROM users WHERE ";
		$query.="users_name='$cuteID' and users_password='$password'";
		$result = db_connect($query);
		$grade=$result->fetch_assoc()['grade'];
		if ($result->num_rows>0&&$grade>0)
		{
			echo '1';
		}
		else if($result->num_rows>0&&$grade==0)
		{
			echo '2';
		}
		else
		{
			echo '0';
		}
	}
}
if($_GET)
{
	if($_GET['action']=='getusersbysearch')
	{
		$stext=$_GET['text'];
		$query="SELECT users_id,users_name,grade,tel,email,birthday,sex,true_name FROM users WHERE grade>=1 AND concat(users_id,users_name,grade,tel,email,birthday,sex,true_name) REGEXP '$stext'";
		$result=db_connect($query);
		if(!$result){echo json_encode('fail');}
		else
		{
			$users=array();
			while($row = $result->fetch_assoc()) 
			{	array_push($users,array('users_id'=>$row['users_id'],'users_name'=>$row['users_name'],'grade'=>$row['grade'],'tel'=>$row['tel'],'email'=>$row['email'],'birthday'=>$row['birthday'],'sex'=>$row['sex'],'true_name'=>$row['true_name']));
    			}
			echo json_encode(array("users" => $users));
		}
	}
	if($_GET['action']=='getallusers')
	{
		$query="SELECT users_id,users_name,grade,tel,email,birthday,sex,true_name FROM users WHERE grade>=1";
		$result=db_connect($query);
		if(!$result){echo json_encode("fail");}
		else
		{
			$users=array();
			while($row = $result->fetch_assoc()) 
			{	array_push($users,array('users_id'=>$row['users_id'],'users_name'=>$row['users_name'],'grade'=>$row['grade'],'tel'=>$row['tel'],'email'=>$row['email'],'birthday'=>$row['birthday'],'sex'=>$row['sex'],'true_name'=>$row['true_name']));
    			}
			echo json_encode(array("users" => $users));
		}
	}
	if($_GET['action']=='getusermessage')
	{
		$name=$_GET['id'];
		$message=array();
		$query="SELECT sum(quantity) AS result FROM borrow_book,borrow,users WHERE users_name='$name' AND borrow_book.borrow_id=borrow.borrow_id AND users.users_id=borrow.users_id";
		array_push($message,db_connect($query)->fetch_assoc()['result']);
		$query="SELECT sum(quantity) AS result FROM borrow_book,borrow,users WHERE users_name='$name' AND borrow_book.borrow_id=borrow.borrow_id AND users.users_id=borrow.users_id AND return_date IS NULL";
		array_push($message,db_connect($query)->fetch_assoc()['result']);
		$query="SELECT grade,tel,email,birthday,sex,true_name FROM users WHERE users_name='$name'";
		$result=db_connect($query)->fetch_assoc();
		array_push($message,$result);
		echo json_encode(array($message));
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
function db_connect_admim($query)
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