
class CoursModel {
    constructor(datas = {}){
        this.label = datas.label || "Nouveau cours";
        this.description = datas.description || "";
        this.content = datas.content || "";
    }
    /**
     * Retourne le corpus de le recherche.
     */
    get corpus(){
        var c = this.label +" " +this.description + " " + this.content;
        return c.toLowerCase();
    }
}
