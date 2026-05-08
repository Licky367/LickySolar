<div class="card" style="max-width:500px;margin:auto;">

<h2 style="margin-bottom:20px;">
Login
</h2>

<form action="/login" method="POST">

<div class="form-group">

<label>Email</label>

<input
type="email"
name="email"
class="form-control"
required
/>

</div>

<div class="form-group">

<label>Password</label>

<input
type="password"
name="password"
class="form-control"
required
/>

</div>

<button class="btn btn-green">
Login
</button>

</form>

<br>

<p>
Don't have an account?
<a href="/signup">
Signup
</a>
</p>

</div>