let md = function(str){
    return str ? markdown.toHTML(str) : ''
};

////////////////////////////////////////////////////////////////////////////////
//
// MODEL
//
////////////////////////////////////////////////////////////////////////////////
class NiveauCollection extends Array {
    constructor(niveaux){
        super();
        niveaux.forEach( data => {
            this.push(data);
        })
    }
}

var Niveaux;

let Cours = {
    template: `<li class="cours">
    <h4 class="item-title layout-line">
        <strong>{{ cours.label}}</strong>
        <nav class="btn-group gc-title-menu">
            <a class="btn btn-xs btn-default" @click.stop.prevent="handlerEdit">
                <i class="fa fa-pencil" aria-hidden="true"></i></a>

            <a class="btn btn-xs btn-default" title="Déplacer après"
                @click.prevent.stop="$emit('moveafter',cours)">
                <i class="fa fa-arrow-down" aria-hidden="true"></i></a>

            <a class="btn btn-xs btn-default" title="Déplacer avant"
                @click.prevent.stop="$emit('movebefore',cours)">
                <i class="fa fa-arrow-up" aria-hidden="true"></i></a>

            <a class="btn btn-xs btn-default" title="Couper cette cours"
                @click.prevent.stop="$emit('cut',cours)">
                <i class="fa fa-scissors" aria-hidden="true"></i></a>

            <a class="btn btn-xs btn-default" title="Copier cette cours"
                @click.prevent.stop="$emit('copy', cours)">
                <i class="fa fa-clone" aria-hidden="true"></i></i></a>

            <a class="btn btn-xs btn-default" title="Coller après cette séquence"
                @click.prevent.stop="$emit('paste', cours)">
                <i class="fa fa-clipboard" aria-hidden="true"></i></a>
        </nav>
    </h4>
    <div v-if="formData">
            <div class="form-group">
                <input type="text" class="form-control"
                    v-model="formData.label"
                    placeholder="Intitulé de la session">
            </div>
            <div class="form-group">
                <textarea class="form-control"
                    v-model="formData.description"
                    placeholder="Description de la session"></textarea>
            </div>
            <div class="form-group">
                <textarea class="form-control"
                    v-model="formData.content"
                    placeholder="Description de la session"></textarea>
            </div>
            <button class="btn btn-default" @click="handlerCancelEdit">Annuler</button>
            <button class="btn btn-primary" @click="handlerValidlEdit">Enregistrer</button>
            </div>
        </div>
    <div class="cours-description" v-show="open" v-html="markdown(cours.description)"></div>
    <div class="cours-content" v-show="open" v-html="cours.content"></div>

    </li>`,
    props:['cours', 'open'],
    data(){
        return {
            formData: null
        }
    },
    methods: {
        handlerEdit(){
            this.formData = {
                label: this.cours.label,
                description: this.cours.description,
                content: this.cours.content
            }
        },
        handlerCancelEdit(){
            this.formData = null;

        },
        handlerValidlEdit(){
            this.cours.label = this.formData.label;
            this.cours.description = this.formData.description;
            this.cours.content = this.formData.content;
            this.formData = null;
        },
        markdown(s){
            return md(s)
        }
    }
};

let Session = {
    props: ['session'],
    components: {
        Cours
    },
    template: `<article class="session session-list-item">
        <h3 @click="session.open = !session.open" class="layout-line item-title">
            <div>
                <i class="fa  fa-caret-down" v-show="session.open == true"></i>
                <i class="fa  fa-caret-right" v-show="session.open == false"></i>
                <strong>{{ session.label}}</strong>
                <small>{{ session.countCours }} cours</small>
            </div>
             <nav class="btn-group gc-title-menu">
                <a class="btn btn-xs btn-default" @click.stop.prevent="handlerEdit">
                    <i class="fa fa-pencil" aria-hidden="true"></i></a>

                <a class="btn btn-xs btn-default" title="Déplacer après"
                    @click.prevent.stop="$emit('moveafter',session)">
                    <i class="fa fa-arrow-down" aria-hidden="true"></i></a>

                <a class="btn btn-xs btn-default" title="Déplacer avant"
                    @click.prevent.stop="$emit('movebefore', session)">
                    <i class="fa fa-arrow-up" aria-hidden="true"></i></a>

                <a class="btn btn-xs btn-default" title="Couper cette session"
                    @click.prevent.stop="handlerCut(session)">
                    <i class="fa fa-scissors" aria-hidden="true"></i></a>

                <a class="btn btn-xs btn-default" title="Copier cette session"
                    @click.prevent.stop="handlerCopy(session)">
                    <i class="fa fa-clone" aria-hidden="true"></i></i></a>

                <a class="btn btn-xs btn-default" title="Coller après cette séquence"
                    @click.prevent.stop="handlerPaste(session)">
                    <i class="fa fa-clipboard" aria-hidden="true"></i></a>
            </nav>
        </h3>
        
        <div v-if="formData">
            <div class="form-group">
                <input type="text" class="form-control"
                    v-model="formData.label"
                    placeholder="Intitulé de la session">
            </div>
            <div class="form-group">
                <textarea class="form-control"
                    v-model="formData.description"
                    placeholder="Description de la session"></textarea>
            </div>
            <button class="btn btn-default" @click="handlerCancelEdit">Annuler</button>
            <button class="btn btn-primary" @click="handlerValidlEdit">Enregistrer</button>
            </div>
        </div>
        
        <div v-show="session.open">
            <p v-html="markdown(session.description)"></p>
        </div>

        <ul v-show="session.open">
            <cours v-for="c, k in session.cours"
                @moveafter="moveCoursAfter(c)"
                @movebefore="moveCoursBefore(c)" 
                @cut="handlerCutCours(c)" 
                @copy="handlerCopyCours(c)" 
                @paste="handlerPasteCours(c)" 
                :cours="c" 
                :open="session.open"></cours>
            <a @click="handlerNewCours">Nouveau cours</a>    
        </ul>
            </article>`,
    data(){
        return {
            formData: null
        }
    },

    methods: {
        handlerCutCours(c){

        },

        handlerCopyCours(c){

        },

        handlerPasteCours(c){

        },

        handlerNewCours(){
            this.session.cours.push(new CoursModel());
        },

        moveCoursAfter(cours){
            var index = this.session.cours.indexOf(cours);
            if( index < this.session.cours.length -1 ){
                this.session.cours.switchIndex(index, index+1);
            }
        },

        moveCoursBefore(cours){
            var index = this.session.cours.indexOf(cours);
            if( index > 0 ){
                this.session.cours.switchIndex(index, index-1);
            }

        },

        handlerEdit(){
            this.formData = {
                label: this.session.label,
                description: this.session.description
            }
        },
        handlerCancelEdit(){
            this.formData = null;
        },
        handlerValidlEdit(){
            this.session.label = this.formData.label;
            this.session.description = this.formData.description;
            this.formData = null;
        },
        markdown(s){
            return md(s)
        }
    }
};

let Sequence = {
    components: {
        Session
    },
    template:
        `
<article class="sequence sequence-list-item" :class="sequence.selected ? 'selected' : ''">
    <h2 @click="sequence.open = !sequence.open" class="layout-line item-title">
        <div class="gc-label">
            <i class="fa fa-folder-open" v-show="sequence.open"></i>
            <i class="fa fa-folder" v-show="!sequence.open"></i>
            {{ sequence.label}}
            <small>( {{ sequence.countSession }} session(s) / {{ sequence.countCours }} cours)</small>
        </div>
            <nav class="btn-group gc-title-menu">
                <a class="btn btn-xs btn-default" @click.stop.prevent="handlerNewSession">
                    <i class="fa fa-plus" aria-hidden="true"></i></a>
                    
                <a class="btn btn-xs btn-default" @click.stop.prevent="handlerEdit">
                    <i class="fa fa-pencil" aria-hidden="true"></i></a>

                <a class="btn btn-xs btn-default" title="Déplacer après"
                    @click.prevent.stop="handlerMoveSequenceAfter(sequence)">
                    <i class="fa fa-arrow-down" aria-hidden="true"></i></a>

                <a class="btn btn-xs btn-default" title="Déplacer avant"
                    @click.prevent.stop="handlerMoveSequenceBefore(sequence)">
                    <i class="fa fa-arrow-up" aria-hidden="true"></i></a>

                <a class="btn btn-xs btn-default" title="Couper"
                    @click.prevent.stop="handlerCut(sequence)">
                    <i class="fa fa-scissors" aria-hidden="true"></i></a>

                <a class="btn btn-xs btn-default" title="Copier cette séquence"
                    @click.prevent.stop="handlerCopy(sequence)">
                    <i class="fa fa-clone" aria-hidden="true"></i></i></a>

                <a class="btn btn-xs btn-default" title="Coller après cette séquence" v-show="sequenceClipboard.length > 0"
                    @click.prevent.stop="handlerPaste(sequence)">
                    <i class="fa fa-clipboard" aria-hidden="true"></i></a>
            </nav>
        </h2>
    <div v-if="formData">
        <div class="form-group">
            <label for="sequencelabel">Intitulé de la séquence</label>
            <input type="text" class="form-control" id="sequencelabel"
                v-model="formData.label"
                aria-describedby="Intitulé de la séquence" placeholder="Intitulé de la séquence">
        </div>
        <div class="form-group">
            <label for="sequencedescription">Description de la séquence</label>
            <textarea class="form-control" id="sequencedescription"
                v-model="formData.description"
                placeholder="Description de la séquence"></textarea>
        </div>
        <div class="form-group">
            <label for="sequencegoal">But de la séquence</label>
            <textarea class="form-control" id="sequencegoal"
                v-model="formData.goal"
                placeholder="But de la séquence"></textarea>
        </div>
        <button class="btn btn-primary" @click="handlerCancelEdit">Annuler</button>
        <button class="btn btn-primary" @click="handlerValidlEdit">Enregistrer</button>
    </div>

    <div v-show="!formData && sequence.open">
        <p v-html="markdown(sequence.description)"></p>
        <div class="goal" style="background-color: rgba(60,142,86,.25)" v-html="markdown(sequence.goal)"></div>
        <div class="sessions">
            <session v-for="session, k in sequence.sessions" 
                   @movebefore="handlerMoveSessionBefore"
                   @moveafter="handlerMoveSessionAfter"
                     :session="session"
                     ></session>
        </div>
    </div>

</article>`,
    props: {
        'sequence': Object,
        'formData': null,
        'sequenceClipboard': {
            type: Array,
            default: ()=> []
        }
    },
    data(){
        return {

        }
    },
    methods: {
        handlerNewSession(){
            this.sequence.sessions.push(new SessionModel());
        },

        handlerMoveSessionAfter(session){
            var index = this.sequence.sessions.indexOf(session);
            if( index < this.sequence.sessions.length ){
                this.sequence.sessions.splice(index+1, 0, this.sequence.sessions.splice(index, 1)[0] );
            }
        },

        handlerMoveSessionBefore(session){
            var index = this.sequence.sessions.indexOf(session);
            if( index > 0){
                this.sequence.sessions.splice(index-1, 0, this.sequence.sessions.splice(index, 1)[0] );
            }
        },
        markdown(s){
            return md(s)
        },
        handlerCancelEdit(){
            this.formData = null;
            this.sequence.edit = false;
        },
        handlerValidlEdit(){
            this.sequence.label = this.formData.label;
            this.sequence.description = this.formData.description;
            this.sequence.goal = this.formData.goal;
            this.formData = null;
            this.sequence.edit = false;
        },

        handlerEdit(){
            this.formData = {
                label: this.sequence.label,
                description: this.sequence.description,
                goal: this.sequence.goal
            };
            this.sequence.edit = true;
        },

        handlerCut(sequence){
            this.$emit('cutsequence', sequence);
        },
        handlerPaste(sequence){
            this.$emit('pastsequence', sequence);
        },
        handlerCopy(sequence){
            this.$emit('copysequence', sequence);
        },
        handlerMoveSequenceAfter(sequence){
            this.$emit('movesequenceafter', sequence);

        },
        handlerMoveSequenceBefore(sequence){
            this.$emit('movesequencebefore', sequence);
        }
    }
};

var selectedSequences = [];
var clipboardSequences = [];

let App = {
    components: {
        Sequence
    },
    template: `<div class="container content application">
    <div class="main">
        <nav class="tabs">
            <span v-for="n, i in niveaux"
                @click="selectedNiveau  = i"
                class="tab" :class="selectedNiveau == i ? 'selected' : ''">
                <span>
                    {{ n.label }}
                    <span class="nbr">{{ n.sequences.length }}</span>
                </span>
    
            </span>
            <span @click="handlerNewNiveau" class="tab">
                <i>Nouveau</i>
            </span>
        </nav>
        <section class="sequences">
            
    
            <a class="btn btn-default" @click="pasteSequence(null, 'before')" v-if="sequenceClipboard.length > 0  && sequencesFiltered.length > 0">Coller la séquence ici</a>
    
            <sequence v-for="sequence in sequencesFiltered" :sequence="sequence" :sequenceClipboard="sequenceClipboard"
                @cutsequence="cutSequence"
                @pastsequence="pasteSequence"
                @copysequence="copySequence"
                @movesequenceafter="moveSequenceAfter"
                @movesequencebefore="moveSequenceBefore"></sequence>
    
             <a class="btn btn-default" @click="pasteSequence()" v-if="sequenceClipboard.length > 0" >Coller la séquence ici</a>
    
        </section>
    </div>
    <aside class="properties">
        <div class="niveau-info" v-if="currentNiveau">
            <h3>{{ currentNiveau.label }}</h3>
            <div v-if="selectedNiveau != null" class="input-group">
                Edition du label
                <input type="text" v-model="niveaux[selectedNiveau].label" class="form-control lg">
            </div>
            <nav>
                <input type="search" class="form-control lg" v-model="search" />
            </nav>
            <nav>
                <a href="#" @click="handlerNewSequence()" class="btn btn-primary">Nouvelle séqence</a>
            </nav>
        </div>
    </aside>
</div>`,
    data(){
        return {
            selectedNiveau: null,
            dblClickTimer: (new Date()).getTime(),
            niveaux: [],
            sequenceClipboard: [],
            search: "",
            initialized: false
        }
    },
    watch: {
        niveaux(){
            console.log("niveaux a changé !");
        }
    },
    computed: {
        currentNiveau(){
            if( this.selectedNiveau != null )
                return this.niveaux[this.selectedNiveau]
            return null
        },

        sequencesFiltered(){
            if( !this.currentNiveau )
                return [];

            if( this.search ){
                var result = [], slc = this.search.toLowerCase();
                this.currentNiveau.sequences.forEach(s=>{
                    if(s.corpus.indexOf(slc)>=0){
                        result.push(s);
                    }
                })
                return result;
            } else {
                return this.currentNiveau.sequences;
            }
        }
    },
    methods: {
        handlerNewSequence(){
            this.currentNiveau.sequences.push(new SequenceModel());
        },

        handlerKeyDown(){
          console.log(arguments);
        },

        handlerNewNiveau(){
            var newNiveau = {
                label: "Nouveau Niveau",
                description: "",
                color: "#ff6600",
                sequences: []
            };
            this.niveaux.push(newNiveau);
            this.selectedNiveau = this.niveaux.indexOf(newNiveau);

        },

        fetch(){
            this.$http.get('/datas.json')
                .then( datas => {
                    datas.data.niveaux.forEach( n => {
                        var niveau = {
                            'label': n.label,
                            'description': n.description,
                            'color': n.color,
                            'sequences': []
                        };
                        n.sequences.forEach(s=>{
                            niveau.sequences.push(new SequenceModel(s));
                        })
                        this.niveaux.push(niveau);
                    });
                    this.selectedNiveau = 0;
            }, err => {
                console.error(err)
            });
        },

        cutSequence(sequence){
            var index = this.currentNiveau.sequences.indexOf(sequence);
            if( index >= 0 ){
                this.sequenceClipboard = [this.currentNiveau.sequences.splice(index, 1)[0]];
            }
        },

        copySequence(sequence){
            var index = this.currentNiveau.sequences.indexOf(sequence);
            if( index >= 0 ){
                this.sequenceClipboard = [this.currentNiveau.sequences[index]];
            }
        },

        pasteSequence(sequence, position){
            console.log("COLLER après", sequence);
            if( sequence == null ){
                if( position == "before" ){
                    this.currentNiveau.sequences.splice(0,0,JSON.parse(JSON.stringify(this.sequenceClipboard[0])));
                } else {
                    this.currentNiveau.sequences.push(JSON.parse(JSON.stringify(this.sequenceClipboard[0])));
                }
            } else {
                var index = this.currentNiveau.sequences.indexOf(sequence);
                this.currentNiveau.sequences.splice(index, 0, JSON.parse(JSON.stringify(this.sequenceClipboard[0])));
            }
            this.sequenceClipboard = [];
        },

        moveSequenceAfter(sequence){
            var fromIndex = this.currentNiveau.sequences.indexOf(sequence);
            if( fromIndex < this.currentNiveau.sequences.length - 1 ){
                var toIndex = fromIndex+1;
                this.currentNiveau.sequences.switchIndex(fromIndex, toIndex);
            }
        },

        moveSequenceBefore(sequence){
            var fromIndex = this.currentNiveau.sequences.indexOf(sequence);
            if( fromIndex > 0 ){
                var toIndex = fromIndex-1;
                this.currentNiveau.sequences.switchIndex(fromIndex, toIndex);
            }
        }
    },
    mounted(){
        /*
        window.addEventListener('keydown', event => {
            // If down arrow was pressed...
            console.log(event.keyCode, event);
            var vm = this;

            //  COPY
            if (event.keyCode == 67 && event.ctrlKey === true) {
                vm.$broadcast('copy');
            }

            //  CUT
            if (event.keyCode == 88 && event.ctrlKey === true) {
                vm.$broadcast('cut');
            }

            //  PASTE
            if (event.keyCode == 86 && event.ctrlKey === true) {
                vm.$broadcast('paste');
            }
        });
        console.log('Created !')
        /****/
        this.fetch();

    }
};

Array.prototype.switchIndex = function(from, to){
    this.splice(to, 0, this.splice(from, 1)[0] );
}
