const postBtn = document.getElementById('postBtn');

postBtn.addEventListener('click', async function () {
    output.textContent = "Sending post...";

    try{
        const response = await fetch(

            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: 'My first post',
                    body: 'i am learning fetch api',
                    userId: 1
                })
            }
        );
        if(!response.ok){
            throw new Error("HTTP Error:" + response.status);
        }
        output.textContent = "POST successfully!";  
    }
}