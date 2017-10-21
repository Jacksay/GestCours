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

class AppBroadcast {
    constructor(){
        this.clipboardSequence = [];
        this.clipboardSession = [];
        this.clipboardCours = [];
        this.changed = false;
    }
}

var appBroadcast =  new AppBroadcast();

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

            <a class="btn btn-xs btn-default" title="Coller après ce cours"
                @click.prevent.stop="$emit('paste', cours)"
                :class="{ 'disabled': appBroadcast.clipboardCours.length == 0 }"
                >
                <i class="fa fa-clipboard" aria-hidden="true"></i></a>
        </nav>
    </h4>
    <div v-show="formData">
            <template v-if="formData">
            <div class="form-group">
                <input type="text" class="form-control"
                    v-model="formData.label"
                    placeholder="Intitulé du cours">
            </div>
            </template>
            <div class="form-group">
                <textarea class="form-control description"
                    placeholder="Description du cours"></textarea>
            </div>
            <div class="form-group">
                <textarea class="form-control content"
                    placeholder="Contenu du cours"></textarea>
            </div>
            <button class="btn btn-default" @click="handlerCancelEdit">Annuler</button>
            <button class="btn btn-primary" @click="handlerValidlEdit">Enregistrer</button>
            </div>
        </div>
    <div class="cours-description" v-show="open" v-html="markdown(cours.description)"></div>
    <a v-if="cours.content" @click="details = !details">&hellip;</a>
    <div class="cours-content" v-show="details" v-html="markdown(cours.content)"></div>

    </li>`,
    props:['cours', 'open'],
    data(){
        return {
            formData: null,
            details: false,
            appBroadcast: appBroadcast,
            mdEditorDescription: null,
            mdEditorContent:  null
        }
    },

    methods: {
        mdDescription(){
            if( this.mdEditorDescription == null ){
                this.mdEditorDescription = new SimpleMDE({ element: this.$el.querySelector('.description') });
            }
            return this.mdEditorDescription;
        },
        mdContent(){
            if( this.mdEditorContent == null ){
                this.mdEditorContent = new SimpleMDE({ element: this.$el.querySelector('.content') });
            }
            return this.mdEditorContent;
        },
        handlerEdit(){
            this.formData = {
                label: this.cours.label,
                description: this.cours.description,
                content: this.cours.content
            };

            this.mdDescription().value(this.cours.description);
            this.mdContent().value(this.cours.content);

            console.log();
            console.log(this.$el.querySelector('.content'));
        },
        handlerCancelEdit(){
            this.formData = null;

        },
        handlerValidlEdit(){
            this.cours.label = this.formData.label;
            this.cours.description = this.mdDescription().value();
            this.cours.content = this.mdContent().value();
            this.formData = null;
            appBroadcast.changed = true;
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
                    @click.prevent.stop="$emit('cutsession', session)">
                    <i class="fa fa-scissors" aria-hidden="true"></i></a>

                <a class="btn btn-xs btn-default" title="Copier cette session"
                    @click.prevent.stop="$emit('copysession', session)">
                    <i class="fa fa-clone" aria-hidden="true"></i></i></a>
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
            <div @click="handlerNewCours" class="cours new-area">
                <i class="fa fa-plus"></i>
                Nouveau cours
            </div>
            <div @click="handlerPasteCours()" class="cours new-area" v-show="appBroadcast.clipboardCours.length > 0">
                <i class="fa fa-plus"></i>
                Coller le cours ici
            </div>
                
        </ul>
            </article>`,
    data(){
        return {
            formData: null,
            appBroadcast: appBroadcast
        }
    },

    methods: {
        handlerCutCours(c){
            console.log("Couper", c);
            var index  =  this.session.cours.indexOf(c);
            if( index >= 0 ){
                var cours = this.session.cours.splice(index, 1)[0];
                appBroadcast.clipboardCours = [cours];
                appBroadcast.changed = true;
            }
        },

        handlerCopyCours(c){
            var index  =  this.session.cours.indexOf(c);
            if( index >= 0 ){
                var cours = this.session.cours[index];
                appBroadcast.clipboardCours = [JSON.parse(JSON.stringify(cours))];
                appBroadcast.changed = true;
            }
        },

        handlerPasteCours(c){
            var index  =  this.session.cours.indexOf(c);
            if( appBroadcast.clipboardCours.length ){
                if( index < 0 ){
                    this.session.cours.push(appBroadcast.clipboardCours[0]);
                } else  {
                    this.session.cours.splice(index+1, 0, appBroadcast.clipboardCours[0]);
                }
                this.appBroadcast.clipboardCours = [];
                appBroadcast.changed = true;
            }
        },

        handlerNewCours(){
            this.session.cours.push(new CoursModel());
            appBroadcast.changed = true;
        },

        moveCoursAfter(cours){
            var index = this.session.cours.indexOf(cours);
            if( index < this.session.cours.length -1 ){
                this.session.cours.switchIndex(index, index+1);
                appBroadcast.changed = true;
            }
        },

        moveCoursBefore(cours){
            var index = this.session.cours.indexOf(cours);
            if( index > 0 ){
                this.session.cours.switchIndex(index, index-1);
                appBroadcast.changed = true;
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
            appBroadcast.changed = true;
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
                   
                <a class="btn btn-xs btn-default" @click.stop.prevent="handlerEdit">
                    <i class="fa fa-pencil" aria-hidden="true"></i></a>

                <a class="btn btn-xs btn-default" title="Déplacer après"  :class="{'disabled': last}"
                    @click.prevent.stop="$emit('movesequenceafter', sequence)">
                    <i class="fa fa-arrow-down" aria-hidden="true"></i></a>

                <a class="btn btn-xs btn-default" title="Déplacer avant" :class="{'disabled': first}"
                    @click.prevent.stop="$emit('movesequencebefore', sequence)">
                    <i class="fa fa-arrow-up" aria-hidden="true"></i></a>

                <a class="btn btn-xs btn-default" title="Couper"
                    @click.prevent.stop="$emit('cutsequence', sequence)">
                    <i class="fa fa-scissors" aria-hidden="true"></i></a>

                <a class="btn btn-xs btn-default" title="Copier cette séquence"
                    @click.prevent.stop="$emit('copysequence', sequence)">
                    <i class="fa fa-clone" aria-hidden="true"></i></i></a>

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
                    @cutsession="handlerCutSession"
                    @copysession="handlerCopySession"
                   @movebefore="handlerMoveSessionBefore"
                   @moveafter="handlerMoveSessionAfter"
                     :session="session"
                     ></session>
            <div class="session new-area" @click.stop.prevent="handlerPasteSession" v-show="appBroadcast.clipboardSession.length">
                <h3><i class="fa fa-paste" aria-hidden="true"></i>
                <strong>Coller la session ici</strong></h3>
            </div>   
            <div class="session new-area" @click.stop.prevent="handlerNewSession">
                <h3><i class="fa fa-plus" aria-hidden="true"></i>
                <strong>Nouvelle session</strong></h3>
            </div>         
                     
        </div>
    </div>

</article>`,
    props: {
        'first': Boolean,
        'last':  Boolean,
        'sequence': Object,
        'formData': null,
        'sequenceClipboard': {
            type: Array,
            default: ()=> []
        }
    },
    data(){
        return {
            appBroadcast: appBroadcast
        }
    },
    methods: {
        handlerNewSession(){
            this.sequence.sessions.push(new SessionModel());
            appBroadcast.changed = true;
        },

        handlerPasteSession(){
            this.sequence.sessions.push(appBroadcast.clipboardSession[0]);
            appBroadcast.changed = true;
        },

        handlerMoveSessionAfter(session){
            var index = this.sequence.sessions.indexOf(session);
            if( index < this.sequence.sessions.length ){
                this.sequence.sessions.splice(index+1, 0, this.sequence.sessions.splice(index, 1)[0] );
                appBroadcast.changed = true;
            }
        },

        handlerCopySession(session){
            var index = this.sequence.sessions.indexOf(session);
            if( index >= 0 ){
                appBroadcast.clipboardSession = [JSON.parse(JSON.stringify(this.sequence.sessions[index]))];
            }
        },

        handlerCutSession(session){
            var index = this.sequence.sessions.indexOf(session);
            if( index >= 0 ){
                appBroadcast.clipboardSession = [this.sequence.sessions.splice(index, 1)[0]];
                appBroadcast.changed = true;
            }
        },

        handlerMoveSessionBefore(session){
            var index = this.sequence.sessions.indexOf(session);
            if( index > 0){
                this.sequence.sessions.splice(index-1, 0, this.sequence.sessions.splice(index, 1)[0] );
                appBroadcast.changed = true;
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
            appBroadcast.changed = true;
        },

        handlerEdit(){
            this.formData = {
                label: this.sequence.label,
                description: this.sequence.description,
                goal: this.sequence.goal
            };
            this.sequence.edit = true;
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
    <div id="loading" class="overlay" v-show="loading">
        <div class="alert alert-info">Chargement</div>
    </div>
    <div id="errors" v-if="error"  class="overlay">
        <div class="alert alert-danger">{{ error }}<a href="#" @click="error = null">Fermer</a></div>
    </div>
    
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
            
    
            <a class="btn btn-default" @click="pasteSequence(null, 'before')" v-show="sequencesFiltered.length == 0 && sequenceClipboard.length > 0">
                Coller la séquence ici
            </a>
    
            <sequence v-for="sequence,i in sequencesFiltered"
                :first="i == 0"
                :last="i == sequencesFiltered.length - 1"
                :sequence="sequence" 
                :sequenceClipboard="sequenceClipboard"
                @cutsequence="cutSequence"
                @pastsequence="pasteSequence"
                @copysequence="copySequence"
                @movesequenceafter="moveSequenceAfter"
                @movesequencebefore="moveSequenceBefore"></sequence>
                
            <div class="sequence new-area" v-show="appBroadcast.clipboardSequence.length" @click="pasteSequence()">
                <h2>
                    <i class="fa fa-paste"></i> Coller la sequence ici
                </h2>
            </div>
            <div class="sequence new-area"  @click="newSequence()">
                <h2>
                    <i class="fa fa-plus"></i> Nouvelle Séquence
                </h2>
            </div>

    
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
            <button @click="save()">Enregistrer</button>
            <pre>
                {{ appBroadcast }}
            </pre>
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
            loading: false,
            error:  null,
            initialized: false,
            appBroadcast:  appBroadcast
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
            appBroadcast.changed = true;
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
            appBroadcast.changed = true;

        },

        save(){
            this.loading = true;
            var formData = new FormData();
            this.$http.post('/', {datas: JSON.stringify(this.niveaux)})
                .then( datas => {
                    this.loading = false;
                    appBroadcast.changed = false;
                }, err => {
                    this.error = err;
                    this.loading = false;
                });
        },

        fetch(){
            this.loading = true;
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
                        this.loading = false;
                    });
                    this.selectedNiveau = 0;
            }, err => {
                    this.loading = false;
                    this.error = err;
            });
        },

        cutSequence(sequence){
            var index = this.currentNiveau.sequences.indexOf(sequence);
            if( index >= 0 ){
                appBroadcast.clipboardSequence = [this.currentNiveau.sequences.splice(index, 1)[0]];
                appBroadcast.changed = true;
            }
        },

        copySequence(sequence){
            var index = this.currentNiveau.sequences.indexOf(sequence);
            if( index >= 0 ){
                appBroadcast.clipboardSequence = [this.currentNiveau.sequences[index]];
            }
        },

        newSequence(){
            this.currentNiveau.sequences.push(new SequenceModel());
            appBroadcast.changed = true;
        },

        pasteSequence(sequence, position){

            if( sequence == null ){
                console.log("COLLER à la position", position);
                if( position == "before" ){
                    this.currentNiveau.sequences.splice(0,0,JSON.parse(JSON.stringify(appBroadcast.clipboardSequence[0])));
                } else {
                    this.currentNiveau.sequences.push(JSON.parse(JSON.stringify(appBroadcast.clipboardSequence[0])));
                }
            } else {
                console.log("COLLER après", sequence);
                var index = this.currentNiveau.sequences.indexOf(sequence);
                this.currentNiveau.sequences.splice(index+1, 0, JSON.parse(JSON.stringify(appBroadcast.clipboardSequence[0])));
            }
            appBroadcast.clipboardSequence = [];
            appBroadcast.changed = true;
        },

        moveSequenceAfter(sequence){
            var fromIndex = this.currentNiveau.sequences.indexOf(sequence);
            if( fromIndex < this.currentNiveau.sequences.length - 1 ){
                var toIndex = fromIndex+1;
                this.currentNiveau.sequences.switchIndex(fromIndex, toIndex);
                appBroadcast.changed = true;
            }
        },

        moveSequenceBefore(sequence){
            var fromIndex = this.currentNiveau.sequences.indexOf(sequence);
            if( fromIndex > 0 ){
                var toIndex = fromIndex-1;
                this.currentNiveau.sequences.switchIndex(fromIndex, toIndex);
                appBroadcast.changed = true;
            }
        }
    },
    mounted(){
        window.onbeforeunload = function(){
            if( appBroadcast.changed == true )
                return 'Are you sure you want to leave?';
            return;
        };
        window.onunload = function(){
            if( appBroadcast.changed == true )
                return 'Are you sure you want to leave?';
            return;
        };
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
