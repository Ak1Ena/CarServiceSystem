This is the actions folder that going to contain 

# Async Action
```
// login
export const login = createAsyncThunk("user/login", async (data, thunkAPI) => {
```
(data,thunkApi) = (req,res)

"user/login" =  ตั้งชื่อ action type เป็น user/login โดยในที่นี้ตั้งเป็น (sliceName/actionName) เพื่อให้ง่ายต่อความเข้าใจ
```
  try {
    const res = await loginUser(data);

```
เป็นการไปขอโหลดข้อมูลมาจาก backend โดยใช้ async โดยใช้ฟังก์ชั่นที่เราเขียนในโฟลเดอร์ API
```
    return res;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

// register
export const register = createAsyncThunk("user/register", async (data, thunkAPI) => {
  try {
    const res = await registerUser(data);
    return res;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

```