import robot from '../images/robotx.png'
import { IoMdCloseCircle } from "react-icons/io";
import { useContext, useState } from 'react'
import './robot.css'
import { IoBookOutline } from "react-icons/io5";
import { S3UrlContext } from '../contexts/s3urlContext';


const Robot = () => {
    const [settings, setSettings]=useState(false);
  
    const [rightCol, setRightCol]=useState('account')

    const [inputs,setInputs]=useState({
      name:'',
      username:'',
      password:'',
      email:''
    });
    const [loginInputs,setLoginInputs]=useState({
      username:'',
      password:''
    })

  const [file, setFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [metadata, setMetadata] = useState({
    title: '',
    author: '',
    category: '',
    fileName:''
  });
  const [s3Url,setS3Url]=useState('')


 const handleChooseFile = () => {
    document.getElementById('hiddenPdfInput').click();
  };
  const handleFileUpload = async () => {
    //sendJUST file to AWS using fetch..not array it was single...
    

       const formData=new FormData();
        formData.append('pdf', file);
      
     
    const res = await fetch('/api/books/upload', {
      method: 'POST',
      body: formData,
       credentials:'include',
    });
    const data=await res.json();
    console.log(data)

    if (res.ok) {
      alert('Book was uploaded!');
      setFormOpen(false);
    }
    // save the S3 URL for rendering later
    const s3Url = data.file.location;
/*     console.log("s3 url: ",s3Url) */
    setS3Url(s3Url);  // for example, store in state


      const metadataRes = await fetch('/api/books/addBook', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: metadata.title,
      author: metadata.author,
      category: metadata.category,
      fileName:s3Url,
    }),
  });
//SEND META DATA TO MONGODB SO THAT TITLE CAN APPEAR DYNAMICALY-----

  const metadataData = await metadataRes.json();
console.log(metadataData)
  if (metadataRes.ok) {
    alert('Book metadata saved successfully!');
    setFormOpen(false);
  } else {
    alert('Saving metadata failed');
  }


  };
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);



       setMetadata((prev) => ({
        ...prev,
        title: selectedFile.name.replace('.pdf', ''),
      }));
      setFormOpen(true); // show popup/modal to get metadata
    }
  };
    const handleSignup=async()=>{
      
console.log(inputs)
      try {
        const res=await fetch('/api/users/signup',{
          method:'POST',
          headers:{'Content-Type':'application/json'},
          credentials:'include',
          body:JSON.stringify(inputs)
        })
        const data=await res.json();
        console.log(data)

        if(res.status===409){
          alert(data.message || 'User Already Exists, try Logging in')
        }else if(res.status===200){
          alert(data.message)
        }
        if(data.error){
          console.log(data.error)
        }
        
      } catch (error) {
                  console.log(error)

      }

      
    }
    const handleLogin=async()=>{
      try {
        console.log(loginInputs)
        const res=await  fetch('/api/users/login',{
          method:'POST',
          headers:{'Content-Type':'application/json'},
          credentials:'include',
          body:JSON.stringify(loginInputs)

        })
        const data=await res.json()
        console.log(data)

            if(res.status===409){
              alert(data.message || 'User Already Exists, try Logging in')
            }else if(res.status===200){
              alert(data.message)
            }
            if(data.error){
              console.log(data.error)
            }
            
        
      } catch (error) {
        console.log(error)
        
      }
    }
   
    return (
    <>
    <div className="robot-wrapper" >
      <img src={robot} className="robot" onClick={()=>setSettings(true)} /> 
    </div>

    {settings && (
    <>
      <div className='overlay' onClick={() => setSettings(false)}></div>

      <div className='popup-container'>
        <div className='popup-header'>
          <IoMdCloseCircle onClick={() => setSettings(false)} className='close-btn' color='#fff' size='30' />
          <h1 className='settings-title'>Libris</h1>
        </div>

        <div className='popup-columns'>
          <div className='col-1'>
            <button onClick={()=>setRightCol('account')} className={(rightCol === 'account'||rightCol==='login'  )?'clicked':''}>Account</button>
            <button onClick={()=>setRightCol('addBook')} className={rightCol==='addBook'?'clicked':''}>Add Book</button>
            <button onClick={()=>setRightCol('quotes')} className={rightCol==='quotes'?'clicked':''}>Qoutes</button>
            <button onClick={()=>setRightCol('highlights')} className={rightCol==='highlights'?'clicked':''}>Highlights</button>
            <button onClick={()=>setRightCol('vocabBox')} className={rightCol==='vocabBox'?'clicked':''}>Vocab Learnt Box</button>
            <button onClick={()=>setRightCol('timeStats')} className={rightCol==='timeStats'?'clicked':''}>Time Spent</button>
          
          </div>
          <div className='col-2'>
           {rightCol==='account' && (
            <>
            <div className='account-heading'>
              <h1>Welcome to Libris!</h1>
              <p>Sign up to enjoy all our cool features!</p>
            </div>
              <div className='account-content'>
                  <div>
                      <div className='names-row'>
                      <div>
                     <label>First Name<span className='red'>*</span></label><br/>
                      <input placeholder='Joni Mitchel' className='names-input' required
									onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
                       value={inputs.name} />
                      </div>
                      <div>
                       <label>Username<span className='red'>*</span></label><br/>
                      <input placeholder='janexadams12'  className='names-input'required
									onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
                      value={inputs.username}/>
                      </div>
                      </div>
                      
                      <div className='email-row'>
                      <label>Email<span className='red'>*</span></label><br/>
                      <input placeholder='krithik@gmail.com' className='email-input' required
									onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
                      value={inputs.email}/>
                      </div>

                      <div className="password-row">
                      <label>Password<span className='red'>*</span></label><br/>
                      <input placeholder='Strong Password' className='password-input' type="password" required
									onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
                      value={inputs.password}/>
                      </div>

                  </div>
                  <div className='account-button'>
                  <button type="button"onClick={handleSignup}> Sign Up</button>
                  <p> Already a User? <span id='blue' onClick={()=>setRightCol('login')}>login</span></p>
                  </div>
            </div>   
          </>
           )}
           {rightCol==='addBook' && (
            <>
             <div className='inner-box'>
             <IoBookOutline  size={300} className='book-icon'/>

              <p>Drag and Drop a PDF File into this Box</p>
              <button type="button" onClick={handleChooseFile}>Choose A File</button>
              <input
                  type="file"
                  id="hiddenPdfInput"
                  accept="application/pdf"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}

             />
            </div>

            {formOpen && (
                    <div className='popup-form'>
                      <h3>Book Info</h3>
                      <input value={metadata.title} onChange={(e) => setMetadata({...metadata, title: e.target.value})} placeholder="Title" />
                      <input value={metadata.author} onChange={(e) => setMetadata({...metadata, author: e.target.value})} placeholder="Author" />
                      <input value={metadata.category} onChange={(e) => setMetadata({...metadata, category: e.target.value})} placeholder="Category" />
                      <button  className="save-book" type="button" onClick={handleFileUpload}>Save</button>
                    </div>
            )}
{/*             <button className="save-book"type="button" onClick={handleAddBook}>Import Book</button>*/}    
            </>
           )}

           {rightCol==='quotes' && (
            <>
             <h1>Qoutes box</h1>
            </>
           )}
           {rightCol==='highlights' && (
            <>
             <h1></h1>
            </>
           )}
           
           {rightCol==='VocabBox' && (
            <>
             <h1>vocab</h1>
            </>
           )}
           {rightCol==='timeStats' && (
            <>
             <h1></h1>
            </>
           )}
           {rightCol==='login' && (
            <>
             <div className='account-heading'>
              <h1>Welcome Back!</h1>
              <p>Log in to access prveious readings</p>
            </div>
              <div className='account-content'>
                  <form className='form'>
                    
                      <div className='email-row'>
                      <label>Username<span className='red'>*</span></label><br/>
                      <input placeholder='krithik@gmail.com' className='email-input' required
                      onChange={(e) => setLoginInputs({ ...loginInputs, username: e.target.value })}
                      value={loginInputs.username}                     
                      />
                      </div>

                      <div className="password-row">
                      <label>Password<span className='red'>*</span></label><br/>
                      <input placeholder='Password' className='password-input' type="password" required  
                      onChange={(e) => setLoginInputs({ ...loginInputs, password: e.target.value })}
                      value={loginInputs.password}    />
                      </div>

                  </form>
                  <div className='account-button'>
                  <button type="button" onClick={handleLogin}> Log in</button>
                  <p> Don't have an acccount? <span id="blue" onClick={()=>{setRightCol('account')}}>Signup</span></p>
                  </div>
            </div>   
            </>
           )}
          
          </div>
        </div>
      </div>
    </>
  )}


    </>
    )
}

export default Robot