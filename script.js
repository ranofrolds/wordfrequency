

const fileinput=document.getElementById('inputfile');
const button=document.getElementById('custom');
const btext=document.getElementById('custom-text');
const analyze=document.getElementById('analyze');
const textarea=document.getElementById('text');
const scrollbutton=document.getElementById('scbutton');
const bdy = document.getElementsByTagName("BODY")[0];

let dic = {};
let found =[];
let txt;
let all;
let words;
let word;
let countAnalyze=0;
let countScDown=0;
let countReset=0;

window.onload = function() {
    window.setTimeout(
        function() { window.scrollTo(0,0); },
        0
    );
};

window.onbeforeunload = function() { window.scrollTo(0,0); }

button.addEventListener("click", ()=>{
    fileinput.click();
});

fileinput.addEventListener("change", ()=>{
    if(fileinput.value){
        btext.innerHTML=fileinput.value.match(/[\/\\]([\w\d\s\.\-\(\)]+)$/)[1];
    }
})

analyze.addEventListener("click", (event)=>{
    if(countAnalyze==0){
        countAnalyze++;
        countReset=0;
        if(fileinput.value||textarea.value){
            document.getElementById('scdown').style.marginTop= "-110px"
            if(fileinput.value){
                const reader = new FileReader();
                reader.readAsText(fileinput.files[0])
                reader.onload = ()=>{
                    console.log(reader.result)
                    const lines=reader.result.split('\n')
                    all=lines.join('\n')
                    words=all.split(/\W+/);
                    console.log(words)

                    for(let i=0; i<words.length; i++){
                        word=words[i].toLowerCase();
                    if(!/\d+/.test(word) && word!=""){
                            if(dic[word]===undefined){
                                dic[word]=1;
                                found.push(word);
                            }
                            else{
                                dic[word]++;
                            }
                    }
                        
                    }

                    found.sort((a,b)=>{
                        let a1 = dic[a];
                        let a2 = dic[b];
                        return a2 - a1;
                    });
                    
                }
            }
            else{
                const lines=textarea.value.split('\n')
                
                all=lines.join('\n')
                words=all.split(/\W+/);
                console.log(words)

                for(let i=0; i<words.length; i++){
                    word=words[i].toLowerCase();
                    if(!/\d+/.test(word) && word!=""){
                        if(dic[word]===undefined){
                            dic[word]=1;
                            found.push(word);
                        }
                        else{
                            dic[word]++;
                        }
                    }
                        
                }

                found.sort((a,b)=>{
                    let a1 = dic[a];
                    let a2 = dic[b];
                    return a2 - a1;
                });
            }
            analyze.style.transition="0.5s"
            analyze.style.opacity="0";
            setTimeout(()=>{
                analyze.style.display="none"
            }, 500)
            
        }
        
    }
})

scrollbutton.addEventListener("click", ()=>{
    if(countScDown==0){
        countScDown++;
    
        bdy.classList.remove('stop-scrolling');
            window.scrollTo({
                top:850,
                left:0,
                behavior:'smooth'
            });
        
        


        for(let i=0; i<found.length; i++){
            var graphs = document.createElement('div'); 
            var drawWord = document.createElement('p'); 
            var results =document.getElementById('results');
            //results.style.height=`${(found.length/4)*15}%`
            drawWord.innerHTML=i+1+"º"+" "+found[i];
            
            graphs.style.gridTemplateRows=`repeat(auto-fit,minmax(100px, 140px))`; 
            
            document.getElementById('graphs').appendChild(graphs); 
            graphs.appendChild(drawWord) 
            graphs.setAttribute("id", "word-stats");
        }

            
            for(let i=0; i<found.length; i++){
                var bardiv=document.createElement('div');
                var bar=document.createElement('div');
                var popup=document.createElement('div');
                var spanpopup=document.createElement('span');

                
                spanpopup.innerHTML=`${dic[found[i]]}`;
                popup.appendChild(spanpopup);
                popup.setAttribute("id", "popupdiv");
                spanpopup.setAttribute("id", "popup");
                

                document.querySelectorAll('#word-stats')[i].appendChild(bardiv); 
                bardiv.setAttribute("id", "bar");

                bar.appendChild(popup)
                bar.style.backgroundColor="white";
                var x = window.matchMedia("(max-width: 564px)")
                if(x.matches){
                    bar.style.width=(90)*(dic[found[i]]/dic[found[0]])+"vw";
                }
                else{
                    bar.style.width=(240)*(dic[found[i]]/dic[found[0]])+"px";
                }
                
                
                if(x.matches){
                popup.style.transform=`translateX(${(90)*(dic[found[i]]/dic[found[0]])-25}vw)`
                }
                else{
                    popup.style.transform=`translateX(${(240)*(dic[found[i]]/dic[found[0]])-25}px)`
                }


                if(i==0 || dic[found[i]]==dic[found[0]]){
                    bardiv.style.boxShadow="1px 1px #baa1d0, 1px 2px #baa1d0";
                }
                bar.style.height="30px"

                document.querySelectorAll('#bar')[i].appendChild(bar);
                bar.setAttribute("id", "bar-result");
            }
            
        
        let data=[];

        for(let i=0; i<found.length; i++){
            data[i]={"x":found[i], "value":dic[found[i]]}
        }
        
        console.log(data)

        var chart = anychart.tagCloud(data);
        // set data with settings
        // set chart title

        chart.background().enabled(true);
        chart.background().fill("#2e2c31 1");

        let customColorScale=anychart.scales.linearColor();

        customColorScale.colors(["#5a3b7e", "#cb9dff"])

        chart
        // set array of angles, by which words will be placed
        .angles([0])
        // enabled color range
        // set color scale
        .colorScale(customColorScale)
        // set settings for normal state
        .normal({
            fontFamily: 'Roboto Mono'
        })
        // set settings for hovered state
        .hovered({
            fill: 'white'
        })
        // set settings for selected state
        .selected({
            fill: 'white',
            fontWeight: 'bold'
        });

        // set container id for the chart
        chart.container('showcloud');
        // initiate chart drawing
        chart.draw();
        
    }
})


const reset = document.getElementById('reset');

reset.addEventListener("click", ()=>{
    if(countReset==0){
        countReset++;
    
        bdy.classList.add('stop-scrolling');
        window.scrollTo({
            top:0,
            left:0,
            behavior:'smooth'
        });

        textarea.value='';
        btext.innerHTML="No file chosen, yet.";
        dic = new Object();
        found =new Array();

        setTimeout(()=>{
            document.getElementById('scdown').style.marginTop= "0"
            analyze.style.opacity="1"
            analyze.style.display="initial"
            countAnalyze=0;
            countScDown=0;
            let myNode = document.getElementById("showcloud");
            while (myNode.firstChild) {
                myNode.removeChild(myNode.lastChild);
            }

            myNode = document.getElementById("graphs");
            while (myNode.firstChild) {
                myNode.removeChild(myNode.lastChild);
            }
        },800)
    }
    
})