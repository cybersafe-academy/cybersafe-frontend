<template>
    <div class='tableContent'>
        <v-row>
            <iframe class="course-video" src="https://www.youtube.com/embed/0pMgFTVLzIw" title="BNT 418 Wspinaczka na Montparnasse w Paryżu 2" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
        </v-row>
        <v-row>
            <v-tabs
                v-model="currentTab"
            >
                <v-tab value='1'>
                    Descrição do curso
                </v-tab>
                <v-tab value='2'>
                    Avaliações
                </v-tab>
                <v-tab value='3'>
                    Teste prático
                </v-tab>
            </v-tabs>
        </v-row>
        <v-row class='mt-9'>
            <v-window class='w-100' v-model="currentTab">
                <v-window-item value="1">
                    <a-row>
                        <p class='text-h4'>{{ course.title }}</p>
                    </a-row>
                    <a-row>
                        <p class='mt-4 text-h7'>{{ course.description }}</p>
                    </a-row>
                    <a-row>
                        <span class="mt-2 d-flex">
                            <b class="mr-1" style="color: #b4761a">{{course.avg_rating.toFixed(1)}}</b>
                            <v-rating
                                class="rating d-flex align-center"
                                color="orange-lighten-1"
                                half-increments
                                v-model="course.avg_rating"
                                readonly
                                density="compact"
                                size="small"
                            />
                        </span>
                    </a-row>
                    <hr class='mt-6 mb-4'>
                    <a-row>
                        <a-col style='margin-right: 200px;'>Autor</a-col>
                        <a-col>John Krasinki</a-col>
                    </a-row>
                    <hr class='mt-4 mb-4'>
                    <a-row>
                        <a-col style='margin-right: 200px;'>Autor</a-col>
                        <a-col>John Krasinki</a-col>
                    </a-row>
                </v-window-item>
                <v-window-item value="2">
                    <div class='d-flex flex-column'>
                        <div class="w-100">
                            <textarea v-model='newRatingComment' class="w-100 mb-6 pa-2" style='border: 1px solid grey;'></textarea>
                            <div class="d-flex align-center">
                                <v-rating
                                    class="rating d-flex align-center mt-2 mr-6"
                                    style='margin-left: -6px;'
                                    color="orange-lighten-1"
                                    half-increments
                                    v-model="newRating"
                                    density="compact"
                                />
                                <v-btn :disabled='!finishedRating' :class='finishedRating ? "bg-green" : "bg-grey"'>Enviar</v-btn>
                            </div>
                        </div>
                        <v-divider class='mt-6 mb-4'/>
                        <div>
                            <div v-for="review in course.reviews">
                                <UserReview :review='review' />
                                <v-divider class='mt-3'/>
                            </div>
                        </div>
                    </div>
                </v-window-item>
                <v-window-item value="3">
                    <div class='mb-1' v-for='question, i in course.questions'>
                        <div class='question'>
                            <p class='text-h6'>{{i}}. {{question.description}}</p>
                        </div>
                        <div class='alternatives d-flex flex-column'>
                            <div :class='alternative.selected ? "alternative selected" : "alternative" ' v-for='alternative, j of question.alternatives' @click='setAlternative(question.alternatives, alternative)'>
                                <p class='text-h6'>{{j+1}}. {{alternative.description}}</p>
                            </div>
                        </div>
                    </div>
                    <div class='mt-4 d-flex justify-end'>
                        <v-btn class='bg-red mr-4' @click="resetAlternatives">Limpar Respostas</v-btn>
                        <v-btn :disabled='!finishedTest' :class='finishedTest ? "bg-green" : "bg-grey"'>Enviar</v-btn>
                    </div>
                </v-window-item>
            </v-window>
        </v-row>
    </div>
</template>

<script lang="ts">
import UserReview from '@/components/UserReview.vue'

export default {
    name: 'CourseView',
    components: {
        UserReview
    },
    props: {
        courseId: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            currentTab: 'teste',
            finishedTest: false,
            answeredQuestions: 0,
            newRatingComment: '',
            newRating: 0,
            course: {
                title: 'Curso de java', 
                description: "Este curso é bem legal, vai ensinar linguagem daora",
                avg_rating: 3,
                reviews: [
                    {user: {name: 'Paulinho gogó',profilePicture: 'https://imagens.brasil.elpais.com/resizer/fk-ECyPRWJZPD2VRJV-HirnItOg=/1200x0/cloudfront-eu-central-1.images.arcpublishing.com/prisa/RYKM5GEQ7ZE6JLUJFJ7Y3ZORFA.jpg'}, comment: 'kk', rating: 3 },
                    {user: {name: 'Paulinho gogó',profilePicture: 'https://imagens.brasil.elpais.com/resizer/fk-ECyPRWJZPD2VRJV-HirnItOg=/1200x0/cloudfront-eu-central-1.images.arcpublishing.com/prisa/RYKM5GEQ7ZE6JLUJFJ7Y3ZORFA.jpg'}, comment: 'kk', rating: 3 }
                ],
                questions: {
                    1: {
                        id: 1,
                        description: 'Quem invetou o rojão?',
                        alternatives: [
                            {
                                alternative_id: 1,
                                question_id: 1,
                                description: 'Oppenheimer'
                            },
                            {
                                alternative_id: 1,
                                question_id: 1,
                                description: 'Rodrigo faro'
                            },
                            {
                                alternative_id: 1,
                                question_id: 1,
                                description: 'Deus'
                            },
                            {
                                alternative_id: 1,
                                question_id: 1,
                                description: 'joao'
                            }
                        ]
                        
                    },
                    2: {
                        id: 1,
                        description: 'Quem invetou o rojão?',
                        alternatives: [
                            {
                                alternative_id: 1,
                                question_id: 1,
                                description: 'Oppenheimer'
                            },
                            {
                                alternative_id: 1,
                                question_id: 1,
                                description: 'Rodrigo faro'
                            },
                            {
                                alternative_id: 1,
                                question_id: 1,
                                description: 'Deus'
                            },
                            {
                                alternative_id: 1,
                                question_id: 1,
                                description: 'joao'
                            }
                        ]
                    }
                }
            }
        }
    },
    computed: {
        finishedRating: function () {
            return this.newRating && this.newRatingComment !== ''
        }
    },
    methods: {
        setAlternative(alternatives: any[], selectedAlternative: any) {
            alternatives.forEach(alternative=>alternative.selected = false);
            selectedAlternative.selected = true
            this.answeredQuestions++
            this.finishedTest = this.answeredQuestions >= Object.keys(this.course.questions).values.length
        },
        resetAlternatives() {
            this.answeredQuestions = 0;
            this.finishedTest = false;
            (Object as any).values(this.course.questions).forEach((question: any)=>question.alternatives.forEach((alternative: any)=>alternative.selected = false))
        }
    }
}
</script>

<style scoped>
    .tableContent {
        width: 100%;
        height: 100%;
        padding: 2rem;
        overflow-y: scroll;
    }
    .course-video {
        width: 100%;
        height: 500px;
    }

    ::v-deep .v-rating__item label {
        display: flex;
        align-items: center;
    }
    .question {
        background-color: #D500F9;
        border-end-start-radius: 10px;
        border-end-end-radius: 10px;
        padding: 5px;
    }

    .alternative {
        cursor: pointer;
        padding: 10px;
    }

    .alternative:hover {
        background-color: #d8d8d8;
    }

    .selected {
        background-color: #bebebe;
    }

</style>