class SessionModel {
    constructor(datas = {}){
        this.label = datas.label || "Nouvelle étape";
        this.description = datas.description || "";
        this.open = false;
        this.edit = false;
        this.cours = [];

        if( datas.cours ){
            datas.cours.forEach(s=>{
                this.cours.push(new CoursModel(s));
            })
        }
    }
    get countCours(){
      return this.cours.length;
    }
    get corpus(){
        var c = this.label +" " +this.description + " " + this.content;
        this.cours.forEach(s=>{
            c += s.corpus;
        })
        return c.toLowerCase();
    }
}
