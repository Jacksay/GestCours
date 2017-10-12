class SequenceModel {
   
    constructor(datas = {}){
        this.label = datas.label || "Nouvelle sequence";
        this.description = datas.description || "";
        this.content = datas.content || "";
        this.goal = datas.goal || "";
        this.open = false;
        this.selected = false;
        this.sessions = [];
        if( datas.sessions ){
            datas.sessions.forEach(s=>{
                this.sessions.push(new SessionModel(s));
            })
        }
    }

    /**
     * Retourne le nombre de sessions.
     */
    get countSession(){
      return this.sessions.length;
    }

    /**
     * Retourne le nombre de cours.
     */
    get countCours(){
      let total = 0;
      this.sessions.forEach( session => {
         total += session.countCours;
      })
      return total;
    }

    /**
     * Retourne le corpus utilisé pour le recherche textuel.
     */
    get corpus(){
        var c = this.label +" " +this.description + " " + this.content;
        this.sessions.forEach(s=>{
            c += s.corpus;
        })
        return c.toLowerCase();
    }
}
