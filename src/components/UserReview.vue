<template>
    <v-container class="ml-5 mt-4">
        <v-row>
            <a-col>
                <!-- <img class='profile-picture' :src="review.user.profilePicture"> -->
            </a-col>
            <a-col class='d-flex flex-column pl-9'>
                <p class='text-h6'>{{review.user.name}}</p>
                <v-rating
                    class="rating d-flex align-center mt-2"
                    style='margin-left: -6px;'
                    color="orange-lighten-1"
                    half-increments
                    v-model="review.rating"
                    readonly
                    density="compact"
                />
                <p class='mt-3'>{{review.comment}}</p>
            </a-col>
        </v-row>
        <v-row></v-row>
    </v-container>
</template>

<script lang="ts">
    export default {
        props: {
            review: {
                type: Object,
                required: true
            }
        },
    }
</script>

<style scoped>
    .profile-picture {
        width: 50px;
        height: 50px;
        border-radius: 50%;
    }

</style>