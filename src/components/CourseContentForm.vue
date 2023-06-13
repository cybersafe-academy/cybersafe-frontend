<template>
    <div>
        <h2 class="mb-6">Contents</h2>
        <div style="padding: 3px;">
            <template v-if="contents.length === 0">
                <h2>No contents registered yet</h2>
            </template>
            <template v-else v-for="(content, i) in contents" v-key='i'>
                <div style="margin-bottom: 20px">
                    <course-content-item :content-item="content"
                        @remove-item="removeCourseContent(i)"></course-content-item>
                </div>
            </template>
            <div class="d-flex flex-end">
                <v-icon
                    style="background-color: green; color: white;width: 30px; height: 30px;margin-left: auto; border-radius: 50%"
                    @click="addCourseContent">mdi-plus</v-icon>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import CourseContentItem from '@/components/CourseContentItem.vue'
export default {
    name: 'CourseContentForm',
    props: {
        contents: {
            type: Array,
            required: true
        }
    },
    components: {
        CourseContentItem
    },
    methods: {
        addCourseContent() {
            this.contents.push({})
        },
        removeCourseContent(index: number) {
            this.contents.splice(index, 1);
        }
    }
}
</script>