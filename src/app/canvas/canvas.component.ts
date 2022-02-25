import { Component, OnInit, Input} from '@angular/core';
import { HostListener } from '@angular/core';
import * as globais from './../../assets/globais';



@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    document.documentElement.style.setProperty('--tamanho-nodo', '20px');
    this.criarMatriz();
  }

  tamanho:number = 20;
  mostrarTamanho:boolean = false;

  velocidadeBolha:number = 5;
  trocaHabilitada:boolean = false;

  selecionouArquivo(ev){
    console.log("Selecionou arquivo", ev);
    let files = ev.target.files;// lista de arquivos inputada no input file
    let reader = new FileReader(); // objeto que le os arquivos
    reader.onload = (e:any)=>{ // funcao plugada no onload do leitor
      console.log("conteudo texto-->",e.target.result);

    };

    reader.readAsText(files[0]); //chamamento da leitura passando a referencia do arquivo.
  }



  clicouTamanho(){
    if(this.mostrarTamanho){
      //aplica
      document.documentElement.style.setProperty('--tamanho-nodo', this.tamanho+'px');
      this.mostrarTamanho = false;
    }else{
      this.mostrarTamanho = true;
    }

    
  }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 
    if(event.key=='w'){
      
      this.movimentar('cima');
    }
    if(event.key=='s'){
      this.movimentar('baixo');
    }
    if(event.key=='a'){
      this.movimentar('esquerda');
    }

    if(event.key=='d'){
      this.movimentar('direita');
    }
  }

  
  horProvisorio:number = 5;
  verProvisorio:number = 5;
 
  randomico:boolean = false;
  estilo:any = 'azul'; //estilo inicial
  valor:any = "";
  risco:boolean = false;
  cruz:boolean = false;
  status:string = "Parado";
  interacoes:number = 0;

  mostrarSliders:boolean = false;


  movimentar(pos){
    if(this.nodoSelecionado){
      if(pos=='cima'){
        let idS = this.nodoSelecionado.id;
        let idA = idS-this.horizontais;
        let destino = this.dicionario[idA];
        if(destino){
          this.trocar(idS,idA);
          this.nodoSelecionado = this.obterGordo(idA);
        }
      }

      if(pos=='baixo'){
        let idS = parseInt(this.nodoSelecionado.id+'');
        let idA = idS+this.horizontais;
        let destino = this.dicionario[idA];
        if(destino){
          this.trocar(idS,idA);
          this.nodoSelecionado = this.obterGordo(idA);
        }
      }

      if(pos=='esquerda'){
        let idS = this.nodoSelecionado.id;
        let idA = idS-1;
        let destino = this.dicionario[idA];
        if(destino){
          this.trocar(idS,idA);
          this.nodoSelecionado = this.obterGordo(idA);
        }
      }

      if(pos=='direita'){
        let idS = parseInt(this.nodoSelecionado.id+'') ;
        let idA = idS+1;
        let destino = this.dicionario[idA];
        if(destino){
          this.trocar(idS,idA);
          this.nodoSelecionado = this.obterGordo(idA);
        }
      }


    }
  }


  obterGordo(id){ // retorna a view e a representacao logica em um só objeto
    let j = this.dicionario[id];
    let e = this.obterHTML(id);
    let gordo:any ={
        id:id,
        objeto:j,
        view:e
    };

    return gordo;
  }


  trocar(id,id2){
      let um = this.obterGordo(id);
      let dois = this.obterGordo(id2);

      let tempHit = um.objeto.hit;
      let tempClasse = um.view.className;
      let tempNome = um.objeto.nome;
      um.objeto.nome = dois.objeto.nome;
      dois.objeto.nome = tempNome;
      um.view.className = dois.view.className;      
      um.objeto.hit = dois.objeto.hit;      
      dois.view.className = tempClasse;      
      dois.objeto.hit = tempHit;
            
            
           
           
  }
  


  @Input('horizontais')horizontais:number=50;// api para numero de horizontais
  @Input('verticais')verticais:number=30;
  dicionarioEl:any =[];

  clicouResetar(){
    if(this.mostrarSliders){
      this.horizontais = this.horProvisorio;
      this.verticais = this.verProvisorio;
      this.resetar();
      this.mostrarSliders = false;
    }else{
      this.mostrarSliders = true;
    }
    
  }

  resetar(){
    if(!this.randomico)this.estilo = 'azul';
    this.dicionario = [];
    this.dicionarioEl = [];
    this.camadas = [];
    this.criarMatriz();
    this.randomico = false;
  }


  clicouDireito(ev){
    
    let id = ev.srcElement.id;
    let el = this.dicionario[id];

    
    
    el.bandeira = !el.bandeira;
    
    return false;
  }

  numeroMinas:number = 15;
  idMaximo:number;


  inserirMinas(){
    this.camadas.filter(ca=>{
      ca.filter(el=>{
        el.caveira = false;
        el.bandeira = false;
      })
    });

    let sorteio:any=[];
    let sorteados:any=[];
    this.dicionario.filter(dic=>{
      sorteio.push(dic);
    });

    for(let i=0;i<this.numeroMinas;i++){
      let escolhido = this.rand(0,sorteio.length-1);
      sorteados.push(sorteio[escolhido]);
      sorteio.splice(escolhido,1);
    }

    sorteados.filter(sr=>{
      sr.caveira=true;
    })



  }


  resetarRandom(){
    this.estilo='amarelo';
    this.randomico = true;
    this.resetar();
  }

  lambrecar(num){
    this.camadas.filter(cc=>{
      cc.filter(el=>{
        let ex = this.obterHTML(el.id);
        if(ex && el.hit==parseInt(num) || parseInt(num+'')==10 )ex.className='azul';
      })
    })
  }

  lambrecar2(num){
    this.camadas.filter(cc=>{
      cc.filter(el=>{
        let ex = this.obterHTML(el.id);
        if(ex && el.hit==parseInt(num) || parseInt(num+'')==10 )ex.className='amarelo';
      })
    })
  }

  lambrecar3(num){
    this.camadas.filter(cc=>{
      cc.filter(el=>{
        let ex = this.obterHTML(el.id);
        if(ex && el.hit==parseInt(num) || parseInt(num+'')==10 )ex.className='vermelho';
      })
    })
  }

  idTarefaMeioSegundo:any;
  tarefaMeioSegundo(funcao){
    this.idTarefaMeioSegundo=setInterval(funcao(),this.velocidadeBolha);
  }

  pararTarefaMeioSegundo(){
    this.espiralando = false;

    clearInterval(this.idTarefaMeioSegundo);
    this.status = "Parado";
  }

  pintando:boolean = false;
  ordenando:boolean = false;

  pintar(){
    if(this.pintando){
      console.log("Parando pintura");
      this.status = "Parado";
      this.pararTarefaMeioSegundo();
      this.pintando = false;
      return;
    }

    if(!this.pintando){
      this.interacoes = 0;
      console.log("Pintando...");
      this.status = "Pintando";
      const f = this.efetuarPintura;
      this.pintando = true;
      // this.tarefaMeioSegundo(f);
      this.idTarefaMeioSegundo = setInterval(()=>{this.efetuarPintura()},this.velocidadeBolha);
      return;
    }

  }

  espiralando:boolean=false;
  espiral1(){
    this.randomizarEspiral = false;
    this.espiral();
  }
  espiral2(){
    this.randomizarEspiral = true;
    this.espiral();
  }
  espiral(){
    let hor = Math.floor(this.horizontais/2);
    let ver = Math.floor(this.verticais/2);
    let meio = hor+(ver*this.horizontais);
    
    var el = this.obterHTML(meio);
    if(!this.randomizarEspiral)el.className = 'amarelo';

    if(this.espiralando){
      console.log("Parando Espiralar");
      this.status = "Parado";
      this.pararTarefaMeioSegundo();
      this.espiralando = false;
      return;
    }

    if(!this.espiralando){
      
      console.log("Espiralando...");
      this.status = "Espiralando...";
      
      this.espiralando = true;
      // this.tarefaMeioSegundo(f);
      this.idAtual = meio;
      this.idCentro = meio;
      this.inicioEspiral();// seta variaveis iniciais
      this.idTarefaMeioSegundo = setInterval(()=>{this.operacaoEspiral()},this.velocidadeBolha);
      return;
    }

  }


  

  cCima:number=0;
  cDireita:number=0;
  cBaixo:number = 0;
  cEsquerda:number=0;

  cima:number = 0;
  direita:number = 0;
  baixo:number = 0;
  esquerda:number = 0;
  idAtual:number = 0;
  idCentro:number = 0;

  vezes:number = 1;

  inicioEspiral(){
    this.cCima = 1;
    this.cDireita = 1;
    this.cBaixo = 2;
    this.cEsquerda = 2;

    this.cima = 0;
    this.direita = 0;
    this.baixo = 0;
    this.esquerda = 0;

    this.vezes=1;
    

  }

  randomizarEspiral:boolean = false;

  digitou(ev){
    console.log('digitou',ev);
  }

  pintarAmarelo(){
    if(this.randomizarEspiral){
        let ej = this.dicionario[this.idAtual];
        if(ej)ej.hit = this.rand(0,9);
    }else{
      let el = this.obterHTML(this.idAtual);
      if(el){
        el.className='amarelo';
      }
    }
    
  }

  vcima(){
    
    this.idAtual-=this.horizontais;
    
    
    this.cima++;
    this.pintarAmarelo();

  }
  vdireita(){
    
    this.idAtual+=1;
    
    this.direita++;
    this.pintarAmarelo();
  }

  vbaixo(){
    
    this.idAtual+=this.horizontais;
    
    this.baixo++;
    this.pintarAmarelo();
  }

  vesquerda(){
    
    this.idAtual-=1;
    
    this.esquerda++;
    this.pintarAmarelo();
  }

  adiciona2(){
    this.cCima+=2;
    this.cima=0;
    this.cDireita+=2;
    this.direita=0;
    this.cBaixo+=2;
    this.baixo=0;
    this.cEsquerda+=2;
    this.esquerda=0;
    this.vezes++;
  }

  operacaoEspiral(){
    
    if(this.cima<this.cCima){
      this.vcima();
      return;
    }

    if(this.direita<this.cDireita){
      this.vdireita();
      return;
    }

    if(this.baixo<this.cBaixo){
      this.vbaixo();
      return;
    }

    if(this.esquerda<this.cEsquerda){
      this.vesquerda();
      return;
    }

    this.adiciona2();
    
  }

  

  ordenar(){
    
    if(this.ordenando){
      console.log("Parando ordenação");
      this.status = "Parado";
      this.pararTarefaMeioSegundo();
      this.ordenando = false;
      return;
    }

    if(!this.ordenando){
      this.contadorBolha = 0;
      console.log("Ordenando...");
      this.status = "Ordenando...";
      
      this.ordenando = true;
      // this.tarefaMeioSegundo(f);
      this.idTarefaMeioSegundo = setInterval(()=>{this.ordenarBolha()},this.velocidadeBolha);
      return;
    }
  }

 

  obterHTML(id){
    let el = this.dicionarioEl[id];
    
    if(el)return el;
    el = document.getElementById(id);
    this.dicionarioEl[id]=el;
    
    return el;
  }

  contadorBolha:number = 0;

  ordenarBolha(){
    let encontrou = false;
    for(let i=0;i<this.camadas.length;i++){
      for(let j=0;j<this.camadas[i].length;j++){
        let elemento =this.obterHTML(this.camadas[i][j].id);
        let id = parseInt(elemento.id+'');
        let elAtual = this.dicionario[id];
        let proximo = this.dicionario[id+1];
        let atuale = this.obterHTML(id);
        let proxe = this.obterHTML(id+1);

        if(proximo){
          if(elAtual.hit>proximo.hit){
            this.contadorBolha++;
            this.trocar(elAtual.id,proximo.id);
            encontrou = true;

            
          }
        }
        // if(encontrou)break;

      }
      // if(encontrou)break;
    }

  }

  efetuarPintura(){// algoritimo executado usando a tarefa de meio segundo
    
    let encontrou = false;
    for(let i=0;i<this.camadas.length;i++){
      for(let j=0;j<this.camadas[i].length;j++){
        let elemento =this.obterHTML(this.camadas[i][j].id);
        
          if(this.camadas[i][j].hit!=0){
            this.interacoes++;
            this.camadas[i][j].hit--;
            encontrou = true;
            break;
          }
          if(elemento.className=='azul'){
            elemento.className='amarelo';
            encontrou = true;
          }
          
          if(encontrou){
            this.interacoes++;
            break;
          }

      }
      if(encontrou)break;
      
    }
    if(!encontrou){
      this.pintando = false;
      this.pararTarefaMeioSegundo();
    }
  }



  nodoSelecionado:any;
  esconderDicas:boolean = false;

  logicaTroca(){
    let original = this.nodoSelecionado;
    let nodoAlvo = this.obterGordo(original.id-1);

    if(nodoAlvo==null)nodoAlvo = this.obterGordo(original.id+1);

    if(nodoAlvo){// estou com mabos os nodos

      document.documentElement.style.setProperty('--oheight', original.view.offsetHeight+'px');
      document.documentElement.style.setProperty('--oleft', original.view.offsetLeft+'px');
      document.documentElement.style.setProperty('--otop', original.view.offsetTop+'px');
      document.documentElement.style.setProperty('--owidth', original.view.offsetWidth+'px');

      document.documentElement.style.setProperty('--dheight', nodoAlvo.view.offsetHeight+'px');
      document.documentElement.style.setProperty('--dleft', nodoAlvo.view.offsetLeft+'px');
      document.documentElement.style.setProperty('--dtop', nodoAlvo.view.offsetTop+'px');
      document.documentElement.style.setProperty('--dwidth', nodoAlvo.view.offsetWidth+'px');

      original.view.className = "mudarOriginal";



    }

  }

  clicou(ev){
    this.nodoSelecionado = this.obterGordo(ev.srcElement.id);
    if(this.trocaHabilitada){
      console.log("Clique com torca habilitado",this.nodoSelecionado);
      this.logicaTroca();

      return;
    }
    
    
    let elemento = ev.srcElement;
    if(this.cruz){
      this.geraCruz(elemento);
    }else{
      this.processarCorEHit(elemento.id);
      
    }
    

    
  }

  processarCorEHit(id){
      let temp = this.obterHTML(id);
      if(temp){
        if(temp.className=='amarelo'){
          temp.className='azul';
        }else if(temp.className=='azul'){
          temp.className='vermelho';
        }else if(temp.className=='vermelho'){
          temp.className='amarelo';
        }
        this.processarHit(temp.id);
      }
      
  }

   rand(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  geraCruz(el){
      let id = parseInt(el.id+'');
      this.processarCorEHit(id-2);
      this.processarCorEHit(id-1);
      this.processarCorEHit(id);
      this.processarCorEHit(id-this.horizontais);
      this.processarCorEHit(id-this.horizontais-this.horizontais);
      this.processarCorEHit(id-this.horizontais-1);
      this.processarCorEHit(id-this.horizontais+1);
      this.processarCorEHit(id+1);
      this.processarCorEHit(id+2);

      this.processarCorEHit(id+this.horizontais);
      this.processarCorEHit(id+this.horizontais+this.horizontais);
      this.processarCorEHit(id+this.horizontais-1);
      this.processarCorEHit(id+this.horizontais+1);


      
  }

  rolou(ev){
    if(this.risco){
      this.clicou(ev);
    }
  }

  processarHit(el){
    
    let ele = this.dicionario[parseInt(el+'')];
    if(ele)if(ele.hit<9)ele.hit++;
  }

  processarEstilo(elemento){
    //console.log(elemento);
    if(elemento.className=='amarelo'){
      elemento.className = 'azul';
    }else if(elemento.className=='azul'){
      elemento.className='amarelo';
    }
  }

  
  camadas:any =[];
  dicionario:any=[];


  criarNodo(ident){
    let bl = {
      
      hit:this.randomico?this.rand(0,9):0,//randomizador de hit
      id:ident,
      bandeira:false,
      caveira:false,
      mina:false,
      nome:globais.nomes[this.rand(0,globais.nomes.length-1)]

    };
    return bl;
  }

  tornarMatrizAcessivel(){
    this.camadas.filter(ca=>{
      ca.filter(el=>{
        this.dicionario[el.id]=el;
        
      });


    });
    
  }

  criarMatriz(){
    let identificador = 0;
    for(let j = 0; j<this.verticais;j++){
      let blocos:any=[];
      for(let i=0;i<this.horizontais;i++){
        
        blocos.push(this.criarNodo(identificador));
        identificador++;
      }
      this.camadas.push(blocos);
    }
    this.idMaximo = identificador;
    
    this.tornarMatrizAcessivel();
  }

  

  

 

}
